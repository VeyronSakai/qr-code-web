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
        // flex: Flexboxコンテナ, min-h-screen: 最小高さ=画面全体, items-center: 垂直方向中央揃え,
        // justify-center: 水平方向中央揃え, bg-black: 黒背景, font-sans: サンセリフ体
        <div className="flex min-h-screen items-center justify-center bg-black font-sans">
            {/* flex: Flexboxコンテナ, w-full: 幅100%, max-w-md: 最大幅448px,
                flex-col: 縦方向に配置, items-center: 子要素を水平中央揃え, gap-8: 子要素間の余白2rem,
                rounded-2xl: 角丸1rem, bg-zinc-900: 濃いグレー背景, p-8: 内側余白2rem, shadow-lg: 大きめの影 */}
            <main
                className="flex w-full max-w-md flex-col items-center gap-8 rounded-2xl bg-zinc-900 p-8 shadow-lg">
                {/* text-2xl: フォントサイズ1.5rem, font-bold: 太字, text-zinc-50: ほぼ白の文字色 */}
                <h1 className="text-2xl font-bold text-zinc-50">
                    QR Code Generator
                </h1>

                {/* 入力エリア: テキスト入力 + 生成ボタン */}
                {/* flex: Flexboxコンテナ, w-full: 幅100%, flex-col: 縦方向に配置,
                    gap-3: 子要素間の余白0.75rem */}
                <div className="flex w-full flex-col gap-3">
                    {/* w-full: 幅100%, rounded-lg: 角丸0.5rem, border: 1pxボーダー,
                        border-zinc-700: ボーダー色(濃いグレー), bg-zinc-800: 濃いグレー背景,
                        px-4: 左右パディング1rem, py-3: 上下パディング0.75rem,
                        text-zinc-50: ほぼ白の文字色, placeholder-zinc-500: プレースホルダー色(グレー),

                        【アクセシビリティ対応】
                        outline-none: デフォルトのフォーカスアウトラインを削除（デザイン統一のため）,
                        focus:border-blue-500 / focus:ring-2 / focus:ring-blue-500/20:
                        代わりにカスタムフォーカススタイルを適用。キーボード操作時にフォーカス位置を
                        視覚的に明示することで、マウスを使わないユーザーのアクセシビリティを確保 */}
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && generateQR()}
                        placeholder="URLまたはテキストを入力"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-50 placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    {/* w-full: 幅100%, rounded-lg: 角丸0.5rem, bg-blue-600: 青色背景,
                        px-4: 左右パディング1rem, py-3: 上下パディング0.75rem,
                        font-medium: フォントウェイト500, text-white: 白文字,
                        transition-colors: 色変化にトランジション適用,
                        hover:bg-blue-700: ホバー時に濃い青, active:bg-blue-800: クリック時にさらに濃い青 */}
                    <button
                        onClick={generateQR}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                    >
                        生成
                    </button>
                </div>

                {/* text-sm: フォントサイズ0.875rem, text-red-500: 赤色文字(エラー表示用) */}
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {/* QRコード表示エリア */}
                {/* canvas は常にDOMに存在するが、QR未生成時は hidden で非表示にする。 */}
                {/* qrDataUrl がセットされると canvas を表示し、ダウンロードリンクも出現する。 */}
                {/* flex: Flexboxコンテナ, flex-col: 縦方向に配置,
                    items-center: 子要素を水平中央揃え, gap-4: 子要素間の余白1rem */}
                <div className="flex flex-col items-center gap-4">
                    {/* rounded-lg: 角丸0.5rem (QR生成時), hidden: 非表示 (QR未生成時) */}
                    <canvas
                        ref={canvasRef}
                        className={qrDataUrl ? "rounded-lg" : "hidden"}
                    />
                    {qrDataUrl && (
                        /* rounded-lg: 角丸0.5rem, border: 1pxボーダー,
                           border-zinc-300: ボーダー色(薄いグレー), px-6: 左右パディング1.5rem,
                           py-2: 上下パディング0.5rem, font-medium: フォントウェイト500,
                           text-zinc-700: グレー文字色, transition-colors: 色変化にトランジション適用,
                           hover:bg-zinc-100: ホバー時に薄いグレー背景,
                           dark:border-zinc-600: ダークモード時ボーダー色,
                           dark:text-zinc-300: ダークモード時文字色,
                           dark:hover:bg-zinc-800: ダークモード時ホバー背景色 */
                        <a
                            href={qrDataUrl}
                            download="qrcode.png"
                            className="rounded-lg border px-6 py-2 font-medium  transition-colors  border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                        >
                            ダウンロード
                        </a>
                    )}
                </div>
            </main>
        </div>
    );
}
