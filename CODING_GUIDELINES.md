# ARK LEAGUE コーディングガイドライン

## 1. 目的

本ガイドラインは、ARK LEAGUEコーポレートサイトのHTML、CSS、JavaScriptを継続的に更新するための実装基準です。既存コードとの一貫性、アクセシビリティ、GitHub Pagesでの動作を優先します。

## 2. 技術構成

- HTML5
- CSS
- Vanilla JavaScript
- 外部ビルドツールなし
- GitHub Pagesで公開可能な静的ファイル構成

フレームワークは、サイト全体の移行方針が決まるまで追加しません。

## 3. ディレクトリ

```text
デザイン/
├─ index.html
├─ style.css
├─ tokens.css
├─ script.js
├─ DESIGN_GUIDELINES.md
├─ CODING_GUIDELINES.md
└─ images/
```

- 画像は `images/` にまとめる
- HTMLからのパスは相対パスにする
- GitHub Pagesのサブディレクトリ公開を考慮し、`/images/...` のようなルート絶対パスを使わない

## 4. HTML

### 基本

- セマンティック要素を優先する
- インデントはスペース2つ
- 属性値はダブルクォート
- 見出しは `h1` から順序を守る
- ナビゲーションには `aria-label` を付ける
- 操作する要素は用途に応じて `a` と `button` を使い分ける

### 画像

- `width` と `height` を指定する
- 意味のある画像には内容が分かる `alt` を付ける
- 装飾画像は `alt=""` にする
- 遅延読み込みが適切な画像には `loading="lazy"` を使用する

### JavaScript用属性

JavaScriptの取得には、見た目のクラスではなく `data-*` 属性を使用します。

```html
<section data-hero></section>
<button data-slide-select></button>
```

CSSクラスの変更だけでJavaScriptが壊れない構成を維持します。

### 仮リンク

リンク先が未確定の場合は `href="#"` を使用します。実URLが決まった段階で一括して置き換えます。

## 5. CSS

### トークン

- 色、文字サイズ、余白、時間、重なり順は `tokens.css` で管理する
- `style.css` にHEX、RGB、任意の余白値を増やさない
- 新しいトークンは用途が複数箇所で再利用される場合に追加する
- 値ではなく役割で命名する

### 命名

BEMに近い形式を使用します。

```css
.hero {}
.hero__slide {}
.hero__slide.is-active {}
.action-button {}
.action-button--disabled {}
```

- ブロック：`.component`
- 要素：`.component__element`
- バリエーション：`.component--variant`
- 状態：`.is-active`、`.is-leaving`、`.is-error`

### 記述順

1. レイアウト・位置
2. サイズ・余白
3. 境界・背景
4. 文字
5. アニメーション・操作

同じコンポーネントのルールを極端に離れた場所へ追加しません。既存ルールを変更できる場合は、末尾へ上書きを積み重ねるより元のルールを更新します。

### レスポンシブ

- モバイルを基本状態とする
- PC向け拡張は `min-width` のメディアクエリを使う
- 画像グリッドには `minmax(0, 1fr)` を使い、内容による横溢れを防ぐ
- `white-space: nowrap` はCTAや短いナビゲーションに限定する

### アニメーション

- `transition: all` を使わない
- 変更するプロパティを明示する
- レイアウトを変えるアニメーションより `opacity` と `transform` を優先する
- `prefers-reduced-motion: reduce` を必ず用意する
- KV切り替えでは `is-active` と `is-leaving` を使い、退出画像の状態をフェード完了まで保持する

## 6. JavaScript

### 構成

- 機能単位のIIFEでスコープを分ける
- DOMが存在しない場合は早期returnする
- 定数は `const`、再代入が必要な値のみ `let`
- スクロール処理は `requestAnimationFrame` で間引く
- スクロールイベントは `{ passive: true }` を使用する

### DOM状態

- 見た目の状態はクラスまたは `data-*` 属性で表す
- ARIA状態も同時に更新する

```js
element.classList.toggle("is-active", active);
element.setAttribute("aria-hidden", String(!active));
```

### タイマー

- タイマーIDを保持し、再設定前に解除する
- CSSの時間トークンとJavaScriptのタイマーを同期する
- 非表示タブでは不要なタイマーを停止する
- 手動操作時はゲージとタイマーを同時にリセットする

### エラー処理

- `sessionStorage` など、利用できない可能性があるAPIは `try...catch` で扱う
- ユーザー入力エラーは画面上の文章と `aria-live` で通知する
- コンソールエラーを残したまま公開しない

## 7. GitHub Pages認証ゲート

### 動作条件

- `location.hostname` が `.github.io` で終わる場合のみ有効
- ローカルファイル、`localhost`、`127.0.0.1` では表示しない
- 認証済み状態は `sessionStorage` に保存する
- ブラウザのタブまたはセッションを終了すると再認証する

### 重要な制限

GitHub Pagesは静的ホスティングのため、サーバー側のBasic認証を提供できません。現在の認証ゲートは閲覧前の簡易制限であり、HTML、CSS、JavaScript、画像を暗号化または非公開にはしません。

以下の用途には使用しないでください。

- 個人情報
- 契約書や機密資料
- 公開前の重要情報
- 外部流出が許されないデータ

本当のアクセス制限が必要な場合は、Cloudflare Access、認証付きホスティング、またはサーバー側認証を利用します。

### 変更時の注意

- 判定処理は `<head>` 内で実行し、ページ内容の一瞬の表示を防ぐ
- 認証UIは `[data-access-*]` で取得する
- 認証画面の重なり順は `--z-access` を使用する
- ID・パスワードを変更しても、セキュリティ強度が上がるわけではない

## 8. アクセシビリティ

- クリック可能領域は最低44px
- `:focus-visible` を削除しない
- フォーム入力には `label` を付ける
- エラーは `role="alert"` または `aria-live` で伝える
- ダイアログには名前と `aria-modal` を設定する
- キーボードのみで主要操作を完了できるようにする

## 9. 検証

変更後は最低限、以下を確認します。

```powershell
node --check .\script.js
```

ブラウザ確認：

- 320px、375px、768px、1280px、1440px
- 横スクロールの有無
- ヘッダーの初期状態とスクロール状態
- KVの自動切り替え、手動切り替え、ゲージ
- モバイルメニュー
- キーボードフォーカス
- 画像読み込み
- GitHub Pages判定時の認証成功・失敗
- ローカル環境では認証画面が出ないこと

## 10. 変更手順

1. 変更対象と影響範囲を確認する
2. 既存トークンとコンポーネントを再利用する
3. HTML、CSS、JavaScriptの役割を分離する
4. 構文チェックを行う
5. PCとモバイルで表示・操作を確認する
6. 新しい恒久ルールが生じた場合は、本書またはデザインガイドラインを更新する
