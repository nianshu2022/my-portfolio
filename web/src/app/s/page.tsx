"use client";

import { useState, useEffect } from "react";
import { 
  Lock, 
  Key, 
  Copy, 
  Upload, 
  RefreshCw, 
  FileText, 
  File, 
  ShieldAlert, 
  Check, 
  CornerDownRight 
} from "lucide-react";
import { encryptData, packFile } from "@/lib/crypto";

// 存留期选项
const EXPIRATION_OPTIONS = [
  { label: "1 小时", value: 3600 },
  { label: "1 天", value: 86400 },
  { label: "7 天", value: 604800 },
  { label: "30 天", value: 2592000 },
  { label: "永久保存 (直至手动删除)", value: 0 },
];

export default function SecureShareCreatePage() {
  const [mounted, setMounted] = useState(false);
  
  // 表单状态
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [expiresIn, setExpiresIn] = useState(86400); // 默认 1 天
  const [burnAfterReading, setBurnAfterReading] = useState(false);
  
  // 运行状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  
  // 结果状态
  const [shareResult, setShareResult] = useState<{
    id: string;
    pin: string;
    isBurn: boolean;
    expSeconds: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    generateRandomPin();
  }, []);

  // 生成 6 位随机 PIN 码
  const generateRandomPin = () => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setPassword(pin);
  };

  // 一键复制辅助函数
  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (e) {
      console.error("复制失败:", e);
    }
  };

  // 文件选择处理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 750 * 1024) {
        setErrorMessage("文件大小不能超过 750KB（受数据库传输限制，适合配置文件、秘钥、短文档）");
        setSelectedFile(null);
        return;
      }
      setErrorMessage("");
      setSelectedFile(file);
    }
  };

  // 提交表单进行加密和存入
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // 表单基础校验
    if (activeTab === "text" && !textContent.trim()) {
      setErrorMessage("请输入需要加密分享的文字内容");
      return;
    }
    if (activeTab === "file" && !selectedFile) {
      setErrorMessage("请选择需要加密分享的文件");
      return;
    }
    if (!password) {
      setErrorMessage("请输入或生成提取安全暗号");
      return;
    }

    setIsSubmitting(true);

    try {
      let plaintext = "";
      
      // 1. 准备明文数据
      if (activeTab === "text") {
        // 文字内容限制在大约 750KB 内
        const bytes = new TextEncoder().encode(textContent);
        if (bytes.length > 750 * 1024) {
          throw new Error("文字内容过长，请精简至 750KB 以内");
        }
        plaintext = JSON.stringify({
          type: "text",
          content: textContent,
        });
      } else if (activeTab === "file" && selectedFile) {
        plaintext = await packFile(selectedFile);
      }

      // 2. 本地客户端端到端加密
      const encrypted = await encryptData(plaintext, password);

      // 3. 上传服务器
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/shares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ciphertext: encrypted.ciphertext,
          iv: encrypted.iv,
          salt: encrypted.salt,
          verifier: encrypted.verifier,
          verifier_salt: encrypted.verifierSalt,
          type: activeTab,
          filesize: activeTab === "file" ? selectedFile?.size : 0,
          burn_after_reading: burnAfterReading,
          expires_in_seconds: expiresIn > 0 ? expiresIn : null,
        }),
      });

      const data = await res.json() as any;

      if (!res.ok) {
        throw new Error(data.error || "存入服务器失败");
      }

      // 4. 记录结果展示
      setShareResult({
        id: data.id,
        pin: password,
        isBurn: burnAfterReading,
        expSeconds: expiresIn,
      });

    } catch (err: any) {
      setErrorMessage(err.message || "加密存入过程中发生错误");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重置表单以继续存入
  const handleReset = () => {
    setTextContent("");
    setSelectedFile(null);
    setBurnAfterReading(false);
    setShareResult(null);
    setErrorMessage("");
    generateRandomPin();
  };

  if (!mounted) return null;

  // 获取分享的完整口令
  const getShareText = (id: string, pin: string) => {
    const origin = window.location.origin;
    const ruleText = burnAfterReading 
      ? "阅后即焚（成功提取1次后立即自毁）" 
      : `${EXPIRATION_OPTIONS.find(o => o.value === expiresIn)?.label || "自定义"}后自动销毁`;
    
    return `【念舒档案局 · 暗号传输柜】\n您有一份机密档案待提取！\n\n提取通道：${origin}/s/${id}\n安全暗号：${pin}\n安全规则：${ruleText}\n\n(提示：发送订阅链接防检测安全通道，请复制链接在浏览器中打开提取)`;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-28 pb-20">
      {/* 头部装饰 */}
      <div className="mb-8 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-500 mb-3">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-black tracking-wider text-foreground">暗号传输柜</h1>
        <p className="mt-2 text-xs font-mono text-muted-foreground">
          SECURE ENCRYPTED TRANSFER TERMINAL // ZERO-KNOWLEDGE ARCHIVE CABINET
        </p>
        <div className="mt-4 flex justify-center gap-1.5 font-mono text-[10px] text-red-500/60 uppercase">
          <span>[端到端加密]</span>
          <span>•</span>
          <span>[防审查拦截]</span>
          <span>•</span>
          <span>[暴破自毁]</span>
        </div>
      </div>

      {!shareResult ? (
        /* 输入表单界面 */
        <form onSubmit={handleSubmit} className="border border-foreground/15 bg-card/40 backdrop-blur-md p-6 relative overflow-hidden shadow-2xl rounded-lg">
          {/* 边角装饰 */}
          <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-500 w-3 h-3" />
          <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-500 w-3 h-3" />
          <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-500 w-3 h-3" />
          <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-500 w-3 h-3" />

          {/* 标签页切换 */}
          <div className="grid grid-cols-2 gap-2 border-b border-foreground/10 pb-4 mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab("text"); setErrorMessage(""); }}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-bold border font-mono transition-all ${
                activeTab === "text"
                  ? "border-red-500 bg-red-500/10 text-red-500"
                  : "border-foreground/10 hover:border-foreground/25 text-muted-foreground"
              }`}
            >
              <FileText className="h-4 w-4" />
              文字暗号 (文本/订阅链接)
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("file"); setErrorMessage(""); }}
              className={`flex items-center justify-center gap-2 py-2.5 text-sm font-bold border font-mono transition-all ${
                activeTab === "file"
                  ? "border-red-500 bg-red-500/10 text-red-500"
                  : "border-foreground/10 hover:border-foreground/25 text-muted-foreground"
              }`}
            >
              <Upload className="h-4 w-4" />
              文件暗号 (配置文件/秘钥)
            </button>
          </div>

          {/* 1. 档案内容输入 */}
          <div className="space-y-4">
            {activeTab === "text" ? (
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {"// 存入的文字内容 (支持魔法链接、明文秘钥等)"}
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="在此输入或粘贴敏感文字、魔法订阅链接等..."
                  rows={8}
                  className="w-full rounded-md border border-foreground/15 bg-background/50 p-3 font-mono text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:border-red-500 focus:outline-none"
                />
                <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground/60">
                  <span>支持包含中英文字符、标点符号</span>
                  <span>容量上限: 750KB</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {"// 拖拽或选择机密文件"}
                </label>
                <div className="relative flex flex-col items-center justify-center border border-dashed border-foreground/20 bg-background/30 rounded-md py-8 px-4 text-center hover:border-red-500/50 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <File className="h-10 w-10 text-red-500" />
                      <div className="max-w-[90%] truncate text-sm font-mono font-bold text-foreground">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground/70 mb-1" />
                      <span className="text-sm font-semibold text-foreground">
                        点击选择文件 或 将文件拖拽至此
                      </span>
                      <span className="text-xs text-muted-foreground/70 max-w-[80%]">
                        仅支持 750KB 以内文件。内容在上传前均会在本地进行强加密，确保隐私万无一失。
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. 提取安全暗号（密码） */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-foreground/10">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  🔑 提取安全暗号 (密码)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="如: 6位数字密码"
                    className="w-full rounded-md border border-foreground/15 bg-background/50 px-3 py-2 font-mono text-sm focus:border-red-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRandomPin}
                    title="生成随机6位暗号"
                    className="flex items-center justify-center border border-foreground/15 hover:border-red-500 bg-background/50 hover:bg-red-500/10 p-2 text-muted-foreground hover:text-red-500 transition-all rounded-md"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-[10px] font-mono text-muted-foreground/60">
                  支持自定义英文、数字，默认已为您随机生成6位数字。
                </p>
              </div>

              {/* 3. 存留期设置 */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  ⏱️ 档案存留期规则
                </label>
                <select
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(Number(e.target.value))}
                  className="w-full rounded-md border border-foreground/15 bg-background/50 px-3 py-2 font-mono text-sm focus:border-red-500 focus:outline-none"
                  disabled={burnAfterReading}
                >
                  {EXPIRATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-neutral-900 text-foreground">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] font-mono text-muted-foreground/60">
                  过期后，服务器将自动彻底清除相关数据，绝不留存。
                </p>
              </div>
            </div>

            {/* 4. 阅后即焚高级设置 */}
            <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 p-3 rounded-md">
              <input
                type="checkbox"
                id="burn-after-reading"
                checked={burnAfterReading}
                onChange={(e) => {
                  setBurnAfterReading(e.target.checked);
                  if (e.target.checked) {
                    setExpiresIn(86400); // 阅后即焚默认伴随最长1天保留期
                  }
                }}
                className="mt-1 cursor-pointer accent-red-600"
              />
              <div className="flex-1">
                <label htmlFor="burn-after-reading" className="block text-xs font-bold text-foreground cursor-pointer">
                  💥 启用「阅后即焚」自毁保护
                </label>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                  开启后，该档案**只要被成功解锁提取1次，便会在服务器中立即永久擦除**，链接彻底失效。非常适合分享魔法订阅链接或高敏感账号密码。
                </p>
              </div>
            </div>
          </div>

          {/* 错误警告展示 */}
          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-md">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 text-white py-3 px-4 font-mono font-bold text-sm tracking-wider uppercase shadow-lg shadow-red-600/15 border border-red-500/30 hover:border-red-500 transition-all rounded-md cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                正在本地进行强加密并存入...
              </>
            ) : (
              <>
                <Key className="h-4 w-4" />
                存入机密档案柜
              </>
            )}
          </button>
        </form>
      ) : (
        /* 生成成功结果展示 */
        <div className="border border-red-500/30 bg-card/60 backdrop-blur-md p-6 relative overflow-hidden shadow-2xl rounded-lg animate-in fade-in zoom-in-95 duration-200">
          {/* 边角装饰 */}
          <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-500 w-3 h-3" />
          <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-500 w-3 h-3" />
          <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-red-500 w-3 h-3" />
          <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-red-500 w-3 h-3" />

          {/* 成功状态标识 */}
          <div className="mb-6 flex items-center gap-3 text-red-500 pb-4 border-b border-foreground/10">
            <Check className="h-5 w-5 bg-red-500 text-background rounded-full p-0.5" />
            <div>
              <h2 className="text-md font-black font-mono">ARCHIVE LOCKED & DEPOSITED</h2>
              <p className="text-[10px] font-mono text-muted-foreground">机密档案已在本地完成军工级加密并安全存入柜中</p>
            </div>
          </div>

          {/* 信息看板 */}
          <div className="space-y-4 font-mono">
            {/* 1. 编号 */}
            <div>
              <span className="text-[10px] text-muted-foreground uppercase">{"// 档案编号 (SLUG)"}</span>
              <div className="mt-1 bg-background/60 border border-foreground/10 px-3 py-1.5 text-sm font-bold tracking-wider text-foreground">
                {shareResult.id}
              </div>
            </div>

            {/* 2. 提取链接 */}
            <div>
              <span className="text-[10px] text-muted-foreground uppercase">{"// 机密提取通道 (支持在微信中直接访问)"}</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/s/${shareResult.id}`}
                  className="w-full bg-background/60 border border-foreground/10 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(`${window.location.origin}/s/${shareResult.id}`, "link")}
                  className="flex items-center justify-center border border-foreground/15 hover:border-red-500 bg-background/50 hover:bg-red-500/10 px-4 text-xs font-bold text-foreground hover:text-red-500 transition-all rounded-md"
                >
                  {copiedStates["link"] ? "已复制" : "复制"}
                </button>
              </div>
            </div>

            {/* 3. 暗号密码 */}
            <div>
              <span className="text-[10px] text-muted-foreground uppercase">{"// 安全提取暗号 (密码)"}</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareResult.pin}
                  className="w-full bg-background/60 border border-foreground/10 px-3 py-2 text-sm font-black tracking-widest text-red-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(shareResult.pin, "pin")}
                  className="flex items-center justify-center border border-foreground/15 hover:border-red-500 bg-background/50 hover:bg-red-500/10 px-4 text-xs font-bold text-foreground hover:text-red-500 transition-all rounded-md"
                >
                  {copiedStates["pin"] ? "已复制" : "复制"}
                </button>
              </div>
            </div>

            {/* 4. 存留规则 */}
            <div className="bg-red-500/5 border border-red-500/10 px-3 py-2 text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">🛡️ 安全规则提示：</span>
              {shareResult.isBurn 
                ? "本档案被设置为「阅后即焚」。任何人成功解锁并读取/下载内容1次后，档案会立即从云端物理抹除，绝不留存。且伴随最长1天闲置失效时间。"
                : `本档案将在 ${EXPIRATION_OPTIONS.find(o => o.value === shareResult.expSeconds)?.label || "到期"} 后自动永久销毁。请在此之前提取。`}
            </div>

            {/* 一键复制全套文案 */}
            <button
              type="button"
              onClick={() => handleCopy(getShareText(shareResult.id, shareResult.pin), "all")}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 font-bold text-sm tracking-wider uppercase shadow-md shadow-red-600/10 border border-red-500/30 hover:border-red-500 transition-all rounded-md cursor-pointer"
            >
              {copiedStates["all"] ? (
                <>
                  <Check className="h-4 w-4" />
                  口令复制成功！快去分享吧
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  一键复制全套提取口令 (推荐)
                </>
              )}
            </button>

            {/* 复制后的社交软件提示 */}
            <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
              温馨提示：一键复制得到的口令可以直接粘贴发送到 微信/QQ/钉钉 等平台。<br />
              由于链接指向您的本站安全路径，不仅防检测防拦截，更能彻底规避直接发送敏感链接导致的失效问题。
            </p>

            {/* 返回按钮 */}
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 flex w-full items-center justify-center gap-2 border border-foreground/15 hover:border-foreground/30 bg-background/50 hover:bg-background text-muted-foreground hover:text-foreground py-2 text-xs font-bold transition-all rounded-md cursor-pointer"
            >
              <CornerDownRight className="h-3.5 w-3.5" />
              继续放入下一份机密档案
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
