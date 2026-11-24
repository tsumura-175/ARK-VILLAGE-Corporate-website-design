# ARK LEAGUE コーディングガイドライン

## 1. 目的

本ガイドラインは、ARK LEAGUEコーポレートサイトのHTML、CSS、JavaScriptを継続的に更新するための実装基準です。既存コードとの一貫性、アクセシビリティ、GitHub Pagesでの動作を優先します。

再利用するUI部品の構造と利用条件は `DESIGN_SYSTEM.md`、表示・操作の見本は `components.html` を参照してください。実績の素材対応は `WORKS_ASSETS.md` が管理します。

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
├─ company/
│  └─ index.html
├─ business/、works/、news/、contact/、privacy-policy/
│  └─ index.html（ニュース詳細・お問い合わせ確認／完了は各サブディレクトリ）
├─ arkgarden-recruit/
│  └─ index.html（飲食横丁・カフェ出店募集）
├─ recruit/
│  └─ index.html、apply/index.html、apply/confirm/index.html、apply/complete/index.html
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css
│  │  ├─ style.css
│  │  └─ subpage.css
│  ├─ js/
│  │  ├─ script.js
│  │  ├─ subpage-content.js（ニュース・お問い合わせの静的試作）
│  │  ├─ pagination.js（NEWS・WORKS・デザイン見本で使う共通ページ送り）
│  │  ├─ subpage-components.js（添付UIの共通動作）
│  │  ├─ works-data.js（Excelに基づくTOP・WORKS共通の実績データ）
│  │  ├─ works.js（共通カード生成・カテゴリ切替・12件単位のページ送り）
│  │  └─ recruit-application.js（求人応募の静的試作）
│  ├─ documents/（支給PDFの格納先）
│  └─ images/
└─ docs/
   ├─ DESIGN_SYSTEM.md
   ├─ DESIGN_GUIDELINES.md
   ├─ CODING_GUIDELINES.md
   ├─ WORKS_ASSETS.md
   ├─ components.html
   └─ components.css（見本の説明・配置専用。サイトには読み込まない）
```

- 画像は `assets/images/` にまとめる
- CSSは `assets/css/`、JavaScriptは `assets/js/` にまとめる
- TOPとWORKSは `works-data.js` を `works.js` より先にdeferで読み込む。画像URLは実行中のスクリプトURLを基準に解決し、GitHub Pagesのサブディレクトリとローカル表示の両方に対応する。実績の更新時は正本Excelと `docs/WORKS_ASSETS.md` を照合する
- ガイドライン類は `docs/` にまとめる
- 下層ページは `ページ名/index.html` とし、公開URLを `/ページ名/` に統一する
- 下層ページ共通のスタイルは `assets/css/subpage.css` にまとめる
- HTMLからのパスは相対パスにする
- GitHub Pagesのサブディレクトリ公開を考慮し、`/assets/...` のようなルート絶対パスを使わない
- CMSやフォーム送信は現段階では未接続。試作用の仮データと完了画面を本番動作として扱わない

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

- 採用した実写真はWebPへ最適化する。取引先名は画像やaltだけで表示せず、`clients-grid` の `ul/li` に読めるテキストとして保持する
- 取引先一覧は企業概要と部品見本で確定した14名称・順序を一致させ、リンクを付けない。法人は指定の正式商号、自治体名・ブランド名は指定表記を使う。ロゴ専用のCSSとサイト用画像は参照がなくなった時点で整理し、資料内の元データは削除しない
- ヒーロー写真は遅延読み込みを使わず、必要な `picture`・寸法・先読みを一致させる。WORKSは `WORKS_ASSETS.md` のPC/SP別画像を参照する
- 差し替え元の資料は変更しない。不要な生成画像は、HTML・CSS・JS・部品見本から参照されていないことを確認した範囲だけ削除する
- 専用の掲載画像は既存のWebP名で上書きする。共用画像の一部の使用先やダミー画像を差し替える場合は、用途を表した別名のWebPを追加し、対象の参照だけを更新する。

### JavaScript用属性

JavaScriptの取得には、見た目のクラスではなく `data-*` 属性を使用します。

```html
<section data-hero></section>
<button data-slide-select></button>
```

CSSクラスの変更だけでJavaScriptが壊れない構成を維持します。

### 固定告知と記事一覧

TOPの `.news-announcement` はCMS記事ループの外側に置き、記事件数・絞り込み・ページ送りから除外する。告知は背景透過・赤い四辺の細枠・小見出しの共通トークンを使用し、見本側で装飾を上書きしない。CMS化、内容変更、募集終了時の対象ファイルと共用画像枠は `DESIGN_SYSTEM.md` 第18章を参照する。

### 仮リンク

操作するリンク先が未確定で仮リンクの指定がない場合は、実際のリンクが届くまで無効状態のボタンを使います。共通ボタンの無効状態は「採用サイト準備中」の見た目に統一します。

出店の応募ボタンはTOP、募集ページの「飲食横丁/カフェ」、スケジュール末尾で共通のGoogleフォームに接続します。フォームでは20ft・40ftの希望区分を選択できるようにします。受付開始までは、各応募ボタンと見本に「2027年2月頃募集開始予定」を押せない共通ボタンで表示します。受付開始後に応募フォームの正式URLを設定します。詳細資料PDFは、正式資料の支給までは同じダミーPDFを使用します。「詳細を見る」は募集ページの先頭、「お問い合わせ」は `contact/?type=vendor#contact-form-section` へ接続します。

### 初回公開時の応募フォーム

初回公開時は、求人応募フォームと飲食出店の応募フォームを公開対象から外す。求人応募の入力・確認・完了画面は静的試作として管理する。求人・出店の募集案内は、受付開始まで募集開始予定を表示し、受付開始に合わせて正式なフォームへのリンクを掲載する。

## 5. CSS

### トークン

- 色、文字サイズ、余白、時間、重なり順は `tokens.css` で管理する
- `style.css` にHEX、RGB、任意の余白値を増やさない
- 新しいトークンは用途が複数箇所で再利用される場合に追加する
- 値ではなく役割で命名する

### 文字トークン・実部品・資料用CSS

- 書体の使い分けは `DESIGN_SYSTEM.md` 第2章を参照する。ページ送りの数字は共通部品の `font-family` だけを `--font-body` に変更する。`--font-display` 自体や、フォームのステップ番号・工程番号・スケジュールの年表示など指定外の書体・文字値は変更しない。

- 文字値・使用条件・使用先の正本は `DESIGN_SYSTEM.md` 第2・13・14章。実値は `tokens.css` の役割別トークンから参照し、汎用 `--text-*` の値は一括変更しない。工程番号とNEWSカテゴリ列には専用トークンを使う。
- サイトのHTMLとJSが実際に使う共通部品を優先する。JSで生成・付与されるクラスも確認し、文字列検索でHTMLにないことだけを削除理由にしない。未使用の将来案は必要になるまで常設しない。
- 英日併記の大見出しは `.section-title__en + h2` の順序と `script.js` の自動配置を使う。日本語のみの大見出しは `.section-title--ja-only` と共通のh2を使う。`.section-title--stacked` はJSが付ける実行時の状態なので保持する。
- ページ送りのAPI・状態・読込順は `DESIGN_SYSTEM.md` 第16章を参照する。NEWSとWORKSで番号生成を複製せず、見本も同じ処理を使う。
- サイト用の共通部品・トークンは `assets/css/`、見本の説明・配置・枠は `docs/components.css` の `.docs-*` に分ける。資料用CSSは `docs/components.html` だけで読む。WordPress移行時もこの境界を維持する。
- 見本内の実部品に対し、資料用CSSから文字サイズ・内余白・装飾を上書きしない。見本名は資料用クラスで共通の小見出しトークンを参照する。技術説明と使用先はMarkdownに記載し、クライアント向けの見本には表示しない。
- TOPの飲食出店ボタンは `.garden-container__actions` の折り返しを使う。募集ページと見本では `.garden-container__action-group` の上段に応募ボタン、下段の `.garden-container__actions` にPDFとお問い合わせを置く。構成と余白は `DESIGN_SYSTEM.md` 第9章を参照する。
- `.process-list` のPC/SP共通の内部配置は共有CSSで行い、ol/li・番号→見出し→本文のDOM順序を保つ。見本専用上書きやページIDの指定を加えない。数値と余白の所有者は `DESIGN_SYSTEM.md` 第9章を参照する。
- 中見出し＋内容には `.content-group.content-group--major` と `.content-group__title` を使う。仕様は `DESIGN_SYSTEM.md` 第2・9章を参照する。通常グループと入れ子の小見出しは維持し、タグ階層は内容に沿って選ぶ。事業の項目名は `.business-capability-grid__label` で指定し、hタグに文字指定を結び付けない。
- 採用施設・募集カードはTOP、採用ページ、見本で `.recruit-facility / .recruit-opening` を共用する。施設名と募集案内はそれぞれ `.page-shell.recruit-facility__inner` で包み、既存の `--section-title-indent` で英字開始位置へ揃える。全幅の施設写真は `.recruit-facility` の直下に置き、TOPのCOMPANY画像枠と高さの指定を共用する。全幅の背景は大見出しを含む親セクションが持ち、各 `.recruit-facility` は親の背景を共有する。構造・breakpoint・subgrid・素材・状態は `DESIGN_SYSTEM.md` 第10章を正本とする。募集バナーの背景・fit指定は既存定義を直接修正する。hover拡大は既存の画像アニメーション定義へセレクターを追加して共用し、対応端末・動きの設定を同じmedia条件で判定する。通常時の縮小やreduced-motion側の縮小上書きを再追加しない。画像URL・ページID・nth-childによる位置補正は使わず、他用途の同一画像へ影響させない。
- 見出しと後続内容の距離は一箇所で所有し、marginと親gapを重ねない。通常情報表はdt/dd各16px。18pxの強調本文はNEWS重要項目と主要条件に保持する。本文の小見出しはh階層を維持したまま標準部品を使う。
- 変更したCSSを読むHTMLのキャッシュ値を更新する。import先も変更した場合はその参照値を更新し、内容を変更していないimport先は据え置く。HTML本文を変更しない場合も、キャッシュ値を変更したファイルを報告する。未コミットの既存変更は保持する。
- 確認幅・数値はデザインシステムを参照する。実計算値・折り返し・局所的な横溢れ・上罫線までの距離・サイトと見本の一致・資料用CSSの非読込を確認する。

### 見出しの余白と背景

- 見出しの前後は役割別の `--type-*-before / -after` を参照する。セクション先頭、直前の内容、直後の部品との距離は `DESIGN_SYSTEM.md` 第2章を参照する。見出しが続く場合は前の見出しの下余白を一度だけ取る。
- 白とグレーの背景指定は `style.css` の共通セクションと `.section-surface--*` に集約する。本文パネルの装飾は `subpage.css` で管理する。見出しと背景の実物見本は `components.html` で確認する。

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
- WORKSのズームは既存の `--dur-nav`・`--ease-out`・拡大率1.035を共用し、hover可能・fine pointer・動きを減らさない設定でのみ実行する。カード高はCSS Gridで揃え、固定高やJS計算を使わない

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
- 認証中はローディングを待機し、`ark:access-granted` イベントを受けてから開始する

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
# 変更したJavaScriptだけを対象にする。WORKS変更時の例：
node --check .\assets\js\works-data.js
node --check .\assets\js\works.js
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
4. JavaScriptを変更した場合は対象ファイルの構文チェックを行う
5. PCとモバイルで表示・操作を確認する
6. 新しい恒久ルールが生じた場合は、本書・デザインシステム・部品見本を必要に応じて更新する
7. docsだけを更新する場合はサイト本体と未コミット変更の非変更、リンク先・見本の画像・IDを確認する。ファイルは更新日が古いという理由だけでは削除しない

## 11. 既存コードの再利用

- 実装前に関連HTML・CSS・JSと共通部品を調べ、同じ機能・見た目を持つ処理を複製しない。
- 既存クラス・関数・トークンの組み合わせを優先し、インラインスタイルや同じルールの別名コピーを追加しない。
- 新しいCSS・JS・SVG等が必要な場合は、追加内容・既存で実現できない理由・対象ファイルを編集前に伝える。ユーザーが追加の確認を求めた場合は回答を待つ。
- 共通部品を変更する場合は使用ページへの影響を確認し、依頼と無関係なリファクタリングはしない。
- クライアント原稿の事実・未確定表記を優先する。根拠のない募集条件・実績説明・交通情報を創作しない。
- 完了時は再利用した部品、変更ファイル、追加コードと理由、確認結果・未完了事項を報告する。
