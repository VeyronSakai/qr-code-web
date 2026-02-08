"use client";

import {useState, useRef} from "react";
import QRCode from "qrcode";

export default function Home() {
    // --- 状態管理 ---
    // ユーザーが入力したテキストまたはURL
    const [text, setText] = useState("");
    // 生成されたQRコード画像のData URL（PNG形式）。ダウンロードリンクの href に使用する。
    // null の場合はQRコードが未生成であることを示す。
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    // エラーメッセージ。バリデーションエラーや生成失敗時にセットされる。
    const [error, setError] = useState<string | null>(null);
    // QRコードの描画先となる <canvas> 要素への参照
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // --- QRコード生成処理 ---
    // 1. 入力値のバリデーション
    // 2. qrcode ライブラリで <canvas> にQRコードを描画
    // 3. canvas の内容を Data URL (PNG) に変換し、state に保存
    //    → qrDataUrl がセットされると、canvas が表示され、ダウンロードリンクが出現する
    const generateQR = async () => {
        if (!text.trim()) {
            setError("テキストまたはURLを入力してください");
            setQrDataUrl(null);
            return;
        }

        try {
            setError(null);
            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }

            // canvas にQRコードを直接描画する
            await QRCode.toCanvas(canvas, text, {
                width: 300,
                margin: 2,
                color: {dark: "#000000", light: "#ffffff"},
            });

            // canvas の内容をPNG形式の Data URL に変換して保存する。
            // この Data URL は <a> タグの href として使われ、ダウンロード可能になる。
            const dataUrl = canvas.toDataURL("image/png");
            setQrDataUrl(dataUrl);
        } catch {
            setError("QRコードの生成に失敗しました");
            setQrDataUrl(null);
        }
    };

    // --- 描画 ---
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main
                className="flex w-full max-w-md flex-col items-center gap-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    QR Code Generator
                </h1>

                {/* 入力エリア: テキスト入力 + 生成ボタン */}
                <div className="flex w-full flex-col gap-3">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && generateQR()}
                        placeholder="URLまたはテキストを入力"
                        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
                    />
                    <button
                        onClick={generateQR}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                    >
                        生成
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {/* QRコード表示エリア */}
                {/* canvas は常にDOMに存在するが、QR未生成時は hidden で非表示にする。 */}
                {/* qrDataUrl がセットされると canvas を表示し、ダウンロードリンクも出現する。 */}
                <div className="flex flex-col items-center gap-4">
                    <canvas
                        ref={canvasRef}
                        className={qrDataUrl ? "rounded-lg" : "hidden"}
                    />
                    {qrDataUrl && (
                        <a
                            href={qrDataUrl}
                            download="qrcode.png"
                            className="rounded-lg border border-zinc-300 px-6 py-2 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            ダウンロード
                        </a>
                    )}
                </div>
            </main>
        </div>
    );
}
