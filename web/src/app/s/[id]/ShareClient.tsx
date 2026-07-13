"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Unlock, 
  Copy, 
  Download, 
  ShieldAlert, 
  RefreshCw, 
  Check, 
  CornerDownLeft, 
  Trash2, 
  FileCheck 
} from "lucide-react";
import { computeVerifier, decryptData, unpackAndDownloadFile } from "@/lib/crypto";

interface ShareMeta {
  type: "text" | "file";
  filesize: number;
  verifier_salt: string;
  burn_after_reading: boolean;
  expires_at: string | null;
  created_at: string;
}

export default function ShareClient({ id }: { id: string }) {
  const router = useRouter();

  // 元数据加载状态
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaError, setMetaError] = useState("");
  const [meta, setMeta] = useState<ShareMeta | null>(null);

  // 解密与输入状态
  const [password, setPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  // 解密成功后的结果状态
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const [isBurned, setIsBurned] = useState(false);

  // 1. 页面加载时拉取元数据
  useEffect(() => {
    if (!id) return;

    const loadMeta = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/shares/${id}/meta`);
        const data = await res.json() as any;

        if (!res.ok) {
          throw new Error(data.error || "获取机密档案元数据失败");
        }

        setMeta(data);
      } catch (err: any) {
        setMetaError(err.message || "档案不存在、已过期或已被永久销毁");
      } finally {
        setLoadingMeta(false);
      }
    };

    loadMeta();
  }, [id]);

  // 一键复制解密文本
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error("复制失败:", e);
    }
  };

  // 解密提取逻辑
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !meta) return;

    setIsUnlocking(true);
    setUnlockError("");

    try {
      // 1. 本地生成密码校验器
      const verifier = await computeVerifier(password, meta.verifier_salt);

      // 2. 发起验证并提取密文
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/shares/${id}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verifier }),
      });

      const data = await res.json() as any;

      if (!res.ok) {
        if (data.remaining !== undefined) {
          setRemainingAttempts(data.remaining);
          if (data.remaining === 0) {
            setMeta(null);
            setMetaError("密码错误次数过多，该机密档案已被永久自毁物理擦除！");
            return;
          }
        }
        throw new Error(data.error || "提取机密档案失败，请检查密码");
      }

      // 3. 验证成功，提取密文并在浏览器本地解密
      const { ciphertext, iv, salt } = data;
      const decrypted = await decryptData(ciphertext, iv, salt, password);
      
      const payload = JSON.parse(decrypted);

      if (meta.type === "text") {
        setDecryptedText(payload.content);
      } else {
        setDecryptedText(decrypted);
      }

      if (meta.burn_after_reading) {
        setIsBurned(true);
      }

    } catch (err: any) {
      setUnlockError(err.message || "解密失败，可能是安全暗号错误");
    } finally {
      setIsUnlocking(false);
    }
  };

  // 下载解密后的文件
  const handleDownloadFile = () => {
    if (!decryptedText || meta?.type !== "file") return;
    try {
      unpackAndDownloadFile(decryptedText);
      setFileDownloaded(true);
    } catch (e: any) {
      setUnlockError(e.message || "还原文件失败");
    }
  };

  // 格式化过期时间显示
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "永久保存";
    const date = new Date(timeStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-28 pb-20">
      {/* 头部装饰 */}
      <div className="mb-8 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-500 mb-3">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-black tracking-wider text-foreground">机密档案阅览室</h1>
        <p className="mt-2 text-xs font-mono text-muted-foreground">
          CONFIDENTIAL ARCHIVE READING ROOM // CODE LOCK RETRIEVAL DECRYPTOR
        </p>
        <div className="mt-4 flex justify-center gap-1.5 font-mono text-[10px] text-red-500/60 uppercase">
          <span>档案编号: {id}</span>
          <span>•</span>
          <span>安全等级: TOP SECRET</span>
        </div>
      </div>

      {/* 1. 元数据加载中 */}
      {loadingMeta && (
        <div className="border border-foreground/15 bg-card/40 backdrop-blur-md p-8 text-center rounded-lg shadow-2xl">
          <RefreshCw className="mx-auto h-8 w-8 text-red-500 animate-spin mb-3" />
          <p className="font-mono text-sm text-foreground">正在检索档案柜元数据，建立安全通道...</p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1">ESTABLISHING SECURE HANDSHAKE...</p>
        </div>
      )}

      {/* 2. 元数据加载失败/档案失效 */}
      {!loadingMeta && metaError && (
        <div className="border border-red-500/30 bg-card/40 backdrop-blur-md p-6 relative overflow-hidden shadow-2xl rounded-lg text-center">
          <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-500 w-3 h-3" />
          <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-500 w-3 h-3" />
          
          <Trash2 className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-md font-black text-red-500 font-mono uppercase mb-2">ACCESS DENIED // 档案已销毁</h2>
          <p className="text-sm font-mono text-foreground leading-relaxed max-w-md mx-auto">
            {metaError}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3 leading-relaxed max-w-md mx-auto">
            原因可能包括：此链接在社交软件中已被分享者主动销毁、设置的存留期到期、或者由于该档案被设置为「阅后即焚」，已在先前被成功读取后从云端物理抹除。
          </p>

          <button
            onClick={() => router.push("/s")}
            className="mt-6 inline-flex items-center gap-2 border border-foreground/15 hover:border-red-500 hover:bg-red-500/10 text-xs font-bold px-4 py-2 text-muted-foreground hover:text-red-500 transition-all rounded-md cursor-pointer"
          >
            <CornerDownLeft className="h-3.5 w-3.5" />
            进入暗号传输柜创建新档案
          </button>
        </div>
      )}

      {/* 3. 输入密码解密界面 */}
      {!loadingMeta && meta && !decryptedText && (
        <form onSubmit={handleUnlock} className="border border-foreground/15 bg-card/40 backdrop-blur-md p-6 relative overflow-hidden shadow-2xl rounded-lg">
          <div className="absolute top-0 left-0 border-t-2 border-l-2 border-red-500 w-3 h-3" />
          <div className="absolute top-0 right-0 border-t-2 border-r-2 border-red-500 w-3 h-3" />

          {/* 柜内档案属性公示 */}
          <div className="bg-background/50 border border-foreground/10 p-4 rounded-md mb-6 font-mono space-y-2 text-xs text-muted-foreground">
            <div>
              <span className="text-foreground font-bold">{"// 档案类型："}</span>
              <span className="text-red-500 font-bold">
                {meta.type === "text" ? "📄 机密文本档案" : `📁 机密文件档案 [ ${(meta.filesize / 1024).toFixed(2)} KB ]`}
              </span>
            </div>
            <div>
              <span className="text-foreground font-bold">{"// 存留期限："}</span>
              <span>{formatTime(meta.expires_at)} 自动物理销毁</span>
            </div>
            {meta.burn_after_reading && (
              <div className="flex items-start gap-1.5 text-red-500 font-bold bg-red-500/5 border border-red-500/15 p-2 rounded mt-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>⚠️ 阅后即焚警示：此档案被设置为「阅后即焚」。成功解锁提取1次后，云端数据将立即永久抹除，此链接将永远失效。</span>
              </div>
            )}
          </div>

          {/* 密码输入框 */}
          <div className="space-y-4 font-mono">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                🔑 请输入安全提取暗号 (密码)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入提取暗号以解锁数据..."
                className="w-full rounded-md border border-foreground/15 bg-background/50 px-3 py-2.5 text-center text-sm font-black tracking-widest text-foreground focus:border-red-500 focus:outline-none"
                required
                autoFocus
              />
            </div>

            {/* 剩余次数警告 */}
            {remainingAttempts !== null && remainingAttempts < 5 && (
              <div className="flex items-center justify-center gap-2 text-[11px] text-red-500 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-md">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span>密码验证错误！您还剩下 <strong className="text-md underline">{remainingAttempts}</strong> 次解锁机会，用尽后该机密档案将**自毁永久物理抹除**。</span>
              </div>
            )}

            {unlockError && remainingAttempts === null && (
              <div className="flex items-center justify-center gap-2 text-[11px] text-red-500 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-md">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span>{unlockError}</span>
              </div>
            )}

            {/* 解锁按钮 */}
            <button
              type="submit"
              disabled={isUnlocking}
              className="flex w-full items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 text-white py-3 px-4 font-bold text-sm tracking-wider uppercase shadow-lg shadow-red-600/15 border border-red-500/30 hover:border-red-500 transition-all rounded-md cursor-pointer"
            >
              {isUnlocking ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  安全密钥握手及本地解密中...
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  解锁并提取机密档案
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 4. 解密成功结果展示 */}
      {!loadingMeta && meta && decryptedText && (
        <div className="border border-emerald-500/30 bg-card/60 backdrop-blur-md p-6 relative overflow-hidden shadow-2xl rounded-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute top-0 left-0 border-t-2 border-l-2 border-emerald-500 w-3 h-3" />
          <div className="absolute top-0 right-0 border-t-2 border-r-2 border-emerald-500 w-3 h-3" />

          {/* 解锁成功条幅 */}
          <div className="mb-6 flex items-center gap-3 text-emerald-500 pb-4 border-b border-foreground/10">
            <FileCheck className="h-5 w-5 bg-emerald-500 text-background rounded-full p-0.5" />
            <div>
              <h2 className="text-md font-black font-mono">ARCHIVE UNLOCKED & DECRYPTED</h2>
              <p className="text-[10px] font-mono text-muted-foreground">本地解密完成，数据验证无误且处于完整状态</p>
            </div>
          </div>

          <div className="space-y-4 font-mono">
            {meta.type === "text" ? (
              /* 文本内容展示 */
              <div>
                <span className="text-[10px] text-muted-foreground uppercase">{"// 解密提取的文字内容"}</span>
                <div className="relative mt-2">
                  <textarea
                    readOnly
                    value={decryptedText}
                    rows={10}
                    className="w-full rounded-md border border-foreground/15 bg-background/60 p-3 font-mono text-sm leading-relaxed text-foreground focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(decryptedText)}
                    className="absolute right-3 bottom-3 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all rounded shadow-md"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        复制文本
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* 文件下载展示 */
              <div className="text-center py-6 border border-dashed border-foreground/10 bg-background/40 rounded-md">
                <FileCheck className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
                <h3 className="text-sm font-bold text-foreground">{"// 文件已成功解密并解包"}</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-6">
                  档案格式已在您的浏览器端无损还原，可直接下载至本地。
                </p>
                <button
                  onClick={handleDownloadFile}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 transition-all rounded-md shadow-lg shadow-emerald-600/10 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  {fileDownloaded ? "再次下载文件" : "下载解密文件"}
                </button>
              </div>
            )}

            {/* 阅后即焚及物理销毁声明 */}
            {isBurned && (
              <div className="bg-red-500/5 border border-red-500/15 p-3 rounded-md text-[11px] text-red-400 leading-relaxed">
                <span className="font-bold text-red-500">💥 物理自毁生效提示：</span>
                本档案为一次性「阅后即焚」通道。服务器端的密文已在您解锁成功的瞬间**彻底物理擦除**。由于服务器不再保留任何记录，此页面一旦关闭或刷新，链接将永远无法再次打开或解密。请务必保存好已提取的内容！
              </div>
            )}

            {!isBurned && (
              <div className="bg-background/50 border border-foreground/10 p-3 rounded-md text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-bold text-foreground">🛡️ 安全规则提示：</span>
                此档案将在到期时间 {formatTime(meta.expires_at)} 自动物理销毁。在此之前，使用正确的提取暗号仍可重复提取阅读或下载。
              </div>
            )}

            {/* 新建档案按钮 */}
            <button
              type="button"
              onClick={() => router.push("/s")}
              className="mt-6 flex w-full items-center justify-center gap-2 border border-foreground/15 hover:border-foreground/30 bg-background/50 hover:bg-background text-muted-foreground hover:text-foreground py-2.5 text-xs font-bold transition-all rounded-md cursor-pointer"
            >
              <CornerDownLeft className="h-3.5 w-3.5" />
              我也要使用「暗号传输柜」安全分享档案
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
