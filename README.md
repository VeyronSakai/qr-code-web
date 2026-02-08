# QR Code Generator

URL やテキストから QR コードを生成し、PNG 画像としてダウンロードできる Web アプリです。

## 技術スタック

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [qrcode](https://www.npmjs.com/package/qrcode) — QRコード生成ライブラリ

## 処理の流れ

1. ユーザーがテキストまたは URL を入力し「生成」ボタンを押す
2. `qrcode` ライブラリが `<canvas>` 要素に QR コードを描画する
3. `canvas.toDataURL()` で canvas の内容を PNG 形式の Data URL に変換する
4. 「ダウンロード」リンク (`<a download>`) の `href` に Data URL をセットし、クリックで PNG ファイルとして保存できる

## 開発

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

## デプロイ

`main` ブランチに push すると GitHub Actions で自動的に GitHub Pages にデプロイされます。
