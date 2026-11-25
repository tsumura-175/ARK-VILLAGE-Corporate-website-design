# ARK LEAGUE デザインシステム

## 1. 役割

本書は、ARK LEAGUEコーポレートサイトで再利用するUI部品の仕様書です。現行のHTML・CSS・JavaScriptと共通部品の仕様を記載します。

- `DESIGN_GUIDELINES.md`：ブランドの方向性とデザイン判断の原則
- `CODING_GUIDELINES.md`：HTML、CSS、JavaScriptの実装規約
- `DESIGN_SYSTEM.md`：再利用する部品の構造、状態、組み合わせ方
- `components.html`：実際の共通CSS・JavaScriptで確認する部品見本
- `WORKS_ASSETS.md`：実績と元写真、出力画像、alt、クレジットの対応
- `assets/css/tokens.css`：色、文字、余白、時間などの実値

ページ固有の見た目を増やす前に、本書の既存部品で表現できないか確認します。

## 2. 基礎要素

### レイアウト幅

- ページ全体：`.page-shell` と `--page-max`
- 通常コンテンツ：`--content-max`
- 下層ページ本文：`--content-narrow`
- 本文の標準行長：`--copy-measure`（`--copy-max` の初期値）。広い構成内の長文は `--copy-wide-measure` を上限にする
- 左右余白：`--page-gutter`

### 文字の役割と数値

SPは768px未満、PCは768px以上で、タブレットもPC値を使います。この境界は文字の仕様に適用し、レイアウト用の640／960／1024／1280px等の境界は維持します。表のpxは標準16px設定での表示目標です。CSSではremと単位なし行間を使用し、htmlの基準文字サイズを固定しません。

| 役割 | PC | SP | 太さ | 行間 | トークン接頭辞 |
| --- | --- | --- | --- | --- | --- |
| 大見出しの英字 | 80px / 5rem | 48px / 3rem | 700 | 1 | `--type-section-en` |
| 大見出しの日本語 | 32px / 2rem | 24px / 1.5rem | 700 | 1.35 | `--type-section-ja` |
| 中見出し | 32px / 2rem | 24px / 1.5rem | 700 | 1.35 | `--type-heading-md` |
| 小見出し | 24px / 1.5rem | 20px / 1.25rem | 700 | 1.5 | `--type-heading-sm` |
| リードコピー | 32px / 2rem | 24px / 1.5rem | 700 | 1.65 | `--type-lead` |
| 本文 | 16px / 1rem | 16px / 1rem | 400 | 1.8 | `--type-body` |
| 強調する本文 | 18px / 1.125rem | 18px / 1.125rem | 500 | 1.8 | `--type-emphasis` |
| 項目ラベル | 16px / 1rem | 16px / 1rem | 700 | 1.5 | `--type-label` |
| 補足・注記 | 14px / 0.875rem | 14px / 0.875rem | 400 | 1.6 | `--type-note` |

各接頭辞に `-size`、`-weight`、`-line` を付けて参照します。日本語の見出し・リード・本文、通常の情報表示、ページネーションの数字は `--font-body`（Noto Sans JP）を使う。フォームのステップ番号、英字の大見出し・コンセプト文・装飾番号・工程番号（スケジュールの工程番号を含む）・スケジュールの年表示、MENU／CLOSE・TOPスライダーの切り替え番号・カードの英字ラベルは `--font-display`（Antonio）を維持する。`--text-*` の既存値は変更せず、ヒーローや操作UIの用途別仕様に残します。

| 役割 | 上の余白 PC／SP | 下の余白 PC／SP | 管理トークン |
| --- | --- | --- | --- |
| 大見出し | 88／64px | 48／32px | `--type-section-before / -after` |
| 中見出し | 48／32px | 24／16px | `--type-heading-md-before / -after` |
| 小見出し | 32／24px | 16／12px | `--type-heading-sm-before / -after` |
| リードコピー | 部品の仕様に従う | 24／16px | `--type-lead-after` |

大見出しの上はセクション先頭から測ります。中・小見出しの上は直前の独立した内容の末尾から測ります。見出しが続く場合は先行見出しの後続余白を使います。大見出しに説明文が伴う場合は、その説明文から後続部品の上端までを測ります。白い本文パネルの内側には上余白としてPC32px／SP24pxを設けます。

大見出しはセクションの始まり、中見出しはセクション内の主要なまとまり、小見出しはカード・職種・内容の小区分です。リードは紹介やメッセージの文章で、見出しと同じサイズでもp要素を使います。HTMLのh1〜h6は内容の構造で選び、サイズを理由に階層を変えません。

### 現行の文字部品と余白の所有者

- 大見出しは `.section-heading` 内の `.section-title` を使い、赤い斜線・英字 `.section-title__en`・直後のh2を一組にする。日本語が英字最終行の右に収まらない場合、`script.js` が `.section-title--stacked` を付けて縦に並べる。狭い画面で縦並びを指定する場合は、初期クラスに `.section-title--stacked` を加えて `data-title-stack-mobile` を指定する。768px未満は縦並び、768px以上は自動配置を使う。見本は [スマホで縦並びの大見出し](components.html#sample-mobile-stacked-title) を参照する。
- 日本語のみの大見出しは `.section-title--ja-only` で赤い斜線・h2・説明文を組み合わせる。h2はNoto Sans JP・700。Noto Sans JPとAntonioの字面の差を補正するため、`--type-section-ja-only-size`（PC72px／SP44px）を使う。英字大見出しはPC80px／SP48px。英日併記の自動配置は英字を含む見出しに適用する。見本は `components.html#sample-ja-heading`。
- 長い日本語の大見出しに `.section-title--long` を併用すると、768px未満で32〜44pxに調整し、斜線を文字サイズに揃える。長い英字の大見出しは `.section-title__en--long` で同じ範囲の画面幅に対して32〜48pxを使う。施設名や語句の区切りは `span.text-phrase` で指定する。見本は [日本語の施設名](components.html#sample-ja-heading) と [英日併記の大見出し](components.html#sample-long-en-heading) を参照する。
- 英日併記で日本語側が長い場合は `.section-title__ja--long` を日本語見出しに加え、768px未満で21〜24pxに調整する。
- 大見出しの後続余白は `.section-heading` のpaddingが所有し、`.content-section__head` も同じトークンを使う。セクション全体の上下paddingや本文プレート内のpaddingとは区別する。
- 中見出しは施設名 `.recruit-facility__name`、交通案内の `.access-information h3`、記事タイトル等の実部品に適用する。小見出しは職種・内容小区分・交通案内・記事本文・ポリシーの実部品に適用する。h要素の数字だけで文字の役割を決めない。
- `.content-group` はgapを0にし、`.content-group__title` 直後の要素のmarginだけで後続余白を確保する。通常は小見出し用 `--type-heading-sm-after`、`.content-group--major` では中見出し用 `--type-heading-md-after`。通常内容間は `--space-lg`、リード直後は `--type-lead-after`。施設・職種カードは既存gridのgapが見出し後の距離を所有する。
- `.content-section__lead + .content-section__copy` と理念の縦積みは共通リード用の後続余白を使う。1024px以上の理念2列のcolumn-gapは既存レイアウトを維持する。
- 情報表は `.definition-list dt` が項目ラベル16px、ddが通常本文16px。募集条件の値 `.summary-facts dd` と重要なお知らせ `.news__item--important p` は強調本文18px。情報表の値を一律18pxにする別バリエーションは設けない。dd内の補足spanは共通の補足仕様を使う。
- 長い施設名・職種名は現行採用カードの自然な折り返しで確認する。個別に縮小したり、見本だけの特別な改行をサイトの仕様として追加したりしない。
- TOPのCONTACTは1024px以上でCTAを見出しの横に配置する。縦に並べる幅では共通の見出し後続余白を使う。768px未満ではCTAの横幅をラベルとアイコンに合わせて中央に配置する。ボタンの文字は14px、ボタンの高さは52pxを基準とし、丸矢印は42pxとする。

### 小見出し・上罫線・工程番号

- `.news-article__body h4` と `.privacy-copy :is(h2, h3)` は標準小見出しを使い、赤い縦線・専用の左余白を持たない。プライバシーポリシーの「個人情報の取り扱い」は `h2`、配下の項目は `h3` とし、同じ書式で本文の左端に揃える。直後の段落の上余白を0にし、見出しの後続余白だけを取る。前の段落や写真からは小見出しの上余白を使う。
- 本文の箇条書きは `ul.prose-list > li` を使う。文字は本文の16px・行間1.8を継承し、黒い丸印を本文の外側に置いて折り返し行の先頭を揃える。項目間は `--space-xs`（8px）。プライバシーポリシーの導入文・補足文とリストの距離は `--space-md`（16px）とする。プライバシーポリシーの本文は共通の `content-section__body--wide` でページ内の本文幅まで広げ、段落と箇条書きには採用カードの本文と同じ `--color-muted` を使う。
- 小見出しから情報表・工程の上罫線までは `--type-heading-sm-after` を使う。情報表・主要条件表・工程の同じ役割の上罫線は `--rule-hair` と `--color-rule` に統一する。表の行内paddingは部品内部の余白として維持する。工程番号下の余白はPC/SPとも使わず、見出しと本文の間隔は小見出しの後続余白で管理する。
- `.process-list__number` は `--process-number-size: 2rem`（標準設定で32px）を参照する。PC/SPともAntonio・700・行間1・既存アクセント色。汎用 `--text-*` の値は変更しない。工程名・説明はそれぞれ標準小見出し・本文。

### NEWSのカテゴリと行構成

TOPの静的HTML、NEWS一覧の `subpage-content.js` による生成、記事詳細のカテゴリが `.news__category` を共用する。カテゴリは補足の14pxを維持し、1行表示する。

- 768px未満：日付・カテゴリを上段、記事タイトルを下段に置き、矢印は右にまとめる。日付列は文字幅、カテゴリ列は残り幅を使い、長いカテゴリも収まる幅を確保する。
- 768px以上：日付・カテゴリ・タイトル・矢印の4列。カテゴリ列は `--news-category-column` を参照し、最長の「重要なお知らせ」7文字×補足文字サイズに左右paddingと左右罫線を加えて確保する。各行のタイトル開始位置は同じになる。
- 記事詳細は既存のflex配置で日付・カテゴリをまとめる。メタ情報全体の折り返しは許可するが、カテゴリ名の内部では改行しない。
- 一覧タイトルの既存1行省略、重要カテゴリの赤い文字・枠・太字は維持する。矢印は通常時に親の黒系文字色を継承し、行全体へのhoverとfocus-visibleでは親のアクセント色を継承する。矢印専用の赤指定は設けない。カテゴリ列を狭いままnowrapだけで押し出さない。

### サイトと資料のCSSの境界

- サイトの正本は `assets/css/tokens.css / style.css / subpage.css`。部品は現行HTML・JSで使うものを基本とし、未使用の将来案を常設しない。必要な部品は必要になった時点で設計する。
- `docs/components.html` は上記の実部品を同じCSSで表示し、追加で `docs/components.css` だけを読む。サイト側のHTMLから資料用CSSを読み込まない。
- `components.html` の表示名は「デザイン見本」。短い見本名・状態名と自然なサンプル文章だけを表示し、ファイル名、クラス名、実装方法、使用先などの技術説明はMarkdownへ置く。
- `.docs-samples / .docs-example / .docs-demo / .docs-actions` は見本の外側の配置用、`.docs-heading` は小見出しトークンを使う見本名。これらはサイトの部品ではない。技術説明用の背景領域と、その専用クラスは削除した。
- 見本の小見出しから部品の上罫線までの距離は `.docs-demo` の上marginだけで管理する。技術説明を置く空の領域を残さず、marginとgapを重ねない。費用表も同じ見本構造を使う。
- 本文幅・リード等の見本では、見本名と実部品の領域を別要素にし、サンプル容器の左枠で区切る。実部品そのもののサイズ・余白・装飾は資料用CSSで上書きしない。リードが説明見出しより大きくても共通のリード値を維持する。
- WordPress移行時はサイトCSSをサイトへ移し、`docs/components.css` と説明用HTMLは資料として分離する。仕様値の正本は本書の第2章、実装値はtokens.css、実際の使用先は第13章とする。

### 色

- 背景、文字、線、アクセントは `assets/css/tokens.css` の既存トークンを使用する
- 赤は斜線、細線、状態表示など小面積に限定する
- コンポーネント内へHEX、RGB、任意色を直接追加しない

## 3. グローバルコンポーネント

### Site Header

- クラス：`.site-header`
- 挙動：ページ上端ではヒーローと一体化し、スクロール後はフローティング表示
- 共通ナビでは実際の現在ページのリンクに `aria-current="page"`、記事詳細やフォームの確認・完了などの親区分には `aria-current="location"` を付ける。PCのグローバルナビ、モバイルメニュー、フッターのリンク一覧では、親区分を破線の下線で示す。
- ヘッダー・モバイルメニュー・フッターは `scripts/site-layout/` の共通テンプレートから各ページとデザイン見本のHTMLに生成する。手順は `CODING_GUIDELINES.md` の「ヘッダー・モバイルメニュー・フッターの更新」を参照する。
- 下層ページからトップ内セクションへ移動する場合は `index.html#section-id` を使う

PCの共通ナビ5項目は16px。項目間は24〜40pxの範囲で画面幅に合わせ、1440pxでは約38px。1152px以上で表示し、未満ではメニューからアクセスする。PCヘッダーの「飲食横丁/カフェ出店募集」リンクは、白文字と半透明の枠線を使い、ボタンの背景は透明とする。

### Mobile Menu

- クラス：`.mobile-menu`
- 開閉取得：`[data-menu-open]`、`[data-menu-close]`
- 各リンクは44px以上の操作領域を維持する

### Site Footer

- クラス：`.site-footer`
- サイト案内、募集・お問い合わせ、関連サイト、ポリシーを共通順序で配置する
- 下層ページでもトップと同じ情報構造を維持する

### Top Key Visual

- クラス：`.hero`。トップページだけで使用する、企業の規模・場・カルチャーを伝えるキービジュアル
- キービジュアル専用の画像は `assets/images/hero/`、他セクションと共用する画像は `assets/images/media/` にWebPで格納し、元支給素材はリポジトリ外の素材フォルダに残す
- `.hero__slide[data-slide]` と `[data-slide-select]` は同数にし、各画像には内容を説明する `alt` を付ける
- ページネーションは2桁番号、細い区切り線、赤い進行線で構成する。枚数が変わる場合も同じ構造を保ち、番号と `aria-label` を更新する
- 現在は3枚構成。画像順は「屋外パーク、屋内パーク、BMXフラットランド」とする
- A案のTOP中央にはロゴ画像を置かず、`.hero__identity` 内の英語h1と日本語コピーを一組として既存の `.hero__content` 表示領域で中央配置する。ロゴ用の高さ・余白・スペーサーは残さない。英語は現行のAntonio・700・2行構成とレスポンシブサイズ、横リビールを維持し、日本語の文字仕様・間隔・入場演出も維持する。ヘッダー・メニュー・フッター・ローダー等のロゴと共用画像は変更しない。
- `object-fit: cover` を基本とし、画面幅に応じて画像ごとに `object-position` を調整する。英語・日本語コピーの可読性は既存のベールで確保し、画像ごとに文字色を変えない
- A案の日本語コピー `.hero__tagline` はPC・SPとも `text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6)` を使用し、明るい背景での可読性を補う。縁取りや背景帯は追加せず、文言・文字仕様・配置・余白・表示演出、英語コピーの既存の影は維持する。
- ホバー中も自動再生と赤い進行線は継続する。キーボードフォーカス中、非表示タブ、`prefers-reduced-motion` 時だけ停止する

### Top Business Showcase

- クラス：`.business-showcase`。トップページの4事業を、写真・事業名・概要・詳細導線で見せるコンポーネント
- 事業固有の画像は `assets/images/business/`、複数セクションで使う画像は `assets/images/media/` にWebPで格納する。利用場所を名前に含めるディレクトリへ、共通素材を重複保存しない
- 現在の画像は「パーク運営、イベント運営、普及活動、自治体・企業との取り組み」の順序で対応させる
- 大会・イベント運営のTOPパネルと下層写真は `assets/images/media/flat-ark-2016-kobe-overview.webp` を共用する。元写真は `頂いた資料/11_1_WORKS/2016/FLAT ARK 2016 in 神戸/JH_FA_KOBE_10302016_009.jpg`。`.media--event img` の表示位置を `60% 50%` とし、競技エリア・周囲の観客を優先する。WORKSの2013年・2016年実績写真とは別用途で管理する。
- 画像の主題に合わせて `.media--park`、`.media--event`、`.media--outreach`、`.media--partnership` の `object-position` を使い分ける
- TOPの自治体・企業との取り組みは、960px未満で `object-position: 80% center` とし、右の2人の顔を優先する。右端固定では2人目が切れるため使わない。PCの構図は従来どおりとする。

### Top Works

- クラス：`.works-grid`。実績を写真・案件名・カテゴリで一覧するコンポーネント
- 実績専用の画像は `assets/images/works/`、他セクションと共用する画像は `assets/images/media/` にWebPで格納する。同じ表示用途の画像を重複保存しない。ヘッダーの端末別トリミングは表示用途が異なるため別画像として最適化する
- TOPは `works-data.js` の共通実績データから、年の降順・同年はExcel行番号の降順で先頭6件を表示する。`works.js` のカード生成処理を実績一覧と共用する
- 追加の写真指定により31件すべてに実写真を使用する。ExcelのFALSE表記は素材の管理履歴として残し、表示画像は最新指定を優先する。ダミー画像は実績カードに使わない。年と記入のある備考だけを併記する
- 複数列ではカードを画像と伸縮する情報欄の2行グリッドにし、同じ行の高さ・情報欄の下端を揃える。固定高やJSの高さ計算は使わない。TOPの全カードは同じ下罫線を持つ。画像ズームは拡大率1.035、`--dur-nav` と `--ease-out` を使い、hover可能・fine pointer・`prefers-reduced-motion: no-preference` の場合だけ適用する
- 選定写真とExcel行の対応、alt、撮影者クレジットは `WORKS_ASSETS.md` に記録する。YUSFの写真は支給されたクレジットを共通 `.media-caption` で画像内に表示する
- TOPと見本の `.work-panel` は白いセクションに置き、罫線には `--color-rule`、年表示には `--color-muted` を使う。実績一覧は `.work-entry` を使う
- 最後の実績カード列から「実績一覧を見る」までの余白はPC48px／SP40px。TOPと見本で `.works__link` を共用する。
- TOPと同じ描画の実物見本は `components.html#sample-works`。データ・画像パスを見本専用に複製しない

### Recruit

- TOP・採用ページ・見本は `.recruit-facilities / .recruit-facility / .recruit-opening` を共用する。施設名→施設写真→募集案内の順序、本文の整列・全幅の写真枠・素材・背景・列数・余白の正本は第10章。
- 採用専用の既存素材は `assets/images/recruit/` を参照し、ページごとに複製しない。仮の施設写真と募集バナーを別要素として扱う。

## 4. 下層ページコンポーネント

### Page Hero

- クラス：`.page-hero`
- 高さ：`--subpage-hero-height`
- 共通要素：`.page-hero__slash`、`.page-hero__title-mask`、`h1`、`.page-hero__rail`。英字を大きく見せる標準形では、タイトル枠内に `.page-hero__title-en` を置く
- 英字と日本語以外の説明文やCTAは原則として置かない
- 背景写真を使う場合は `.page-hero--image` と `.page-hero__media` を追加する。写真の上にも既存の斜め面・グリッド・赤いレールを残し、文字の可読性は暗いベールで確保する
- 背景写真が他ページと共通の場合は `assets/images/media/` を参照し、ページ専用の複製を作らない
- 表示制御には `[data-page-hero-reveal]` を利用し、ローダー完了後に開始する
- `prefers-reduced-motion` では移動とクリップアニメーションを無効化する

```html
<section class="page-hero" aria-labelledby="page-title">
  <div class="page-shell page-hero__inner">
    <div class="page-hero__title" data-page-hero-reveal>
      <span class="page-hero__slash" aria-hidden="true"></span>
      <div class="page-hero__title-mask">
        <p class="page-hero__title-en" aria-hidden="true">COMPANY</p>
      </div>
      <h1 id="page-title">企業概要</h1>
    </div>
  </div>
  <span class="page-hero__rail" aria-hidden="true"></span>
</section>
```

下層KVの英字と日本語は同じタイトル枠に置き、間隔は `--page-hero-title-gap`（PC24px／SP20px）で統一する。

主見出しが日本語の場合は、`.page-hero__title` に `.page-hero__title--ja` を加え、タイトル枠内に `h1.page-hero__title-ja` を置く。Noto Sans JP 700、文字サイズは28〜76px、行高は1.15。タイトル枠は標準形の英字1行分の高さを確保し、主見出しが改行するときは行数に応じて広げる。長い名称は `<wbr>` で語の区切りを指定し、「公園（仮称）」のように一緒に表示する箇所は `.page-hero__title-unit` でまとめる。募集種別などの副見出しには `.page-hero__subtitle` を使い、標準形の日本語テキストと同じ16px・余白で表示する。見本は [components.html](components.html#sample-page-hero-ja) を参照。

### Content Section

- クラス：`.content-section`
- 背景は `.content-section--base` と `.content-section--tinted` の2種類を共通バリエーションとして使う。大見出しを持つ外側のセクションで色を指定する。色指定と初期値は `style.css`、本文プレート・黒い横線・構造グリッド等は `subpage.css` で管理する。
- `--base` は白（#FFFFFF）、`--tinted` はグレー（#EAEAEA）。背景だけを指定する `.section-surface--base / --tinted` を併用すると、その背景色を優先する。
- 本文の最初の大見出しから白・グレーを交互に使う。切り替え位置は大見出しを含むセクションの先頭とする。
- 設計補助線は縦線1本、長さの異なる横線2本、小さな赤い基準マークで構成し、全面反復パターンにはしない
- `--tinted` の本文領域は角丸や影のない白いコンテンツプレートとし、section-titleはプレートの外に残す
- コンテンツプレートは情報をまとめる大きな面として使い、内部の項目を個別の白いカードへ分割しない
- セクション全体の実背景色は `--section-surface` で管理する
- コンテンツの実背景色は `--content-surface` で管理し、前景の罫線部品にも同じ値を使用する
- 設計補助線はコンテンツプレートの背後へ透過させず、周囲の余白部分だけに見せる
- 見出し領域と本文領域を `.content-section__grid` で管理する
- 見出しはトップページと同じ `.section-heading` / `.section-title` を使い、赤い斜線、英字、日本語の順で統一する。文字の値は第2章の役割別仕様を使う
- 英字と日本語の見出しは、共通のサイズ・行間・間隔・文字色を使う。自動配置では、親領域の右端と日本語の文字幅を比較し、日本語が収まれば英字の最終行の右に、収まらなければ英字の下に左揃えで置く。`data-title-stack-mobile` を指定した見出しは、768px未満で縦に並べる。英字は語の区切りで折り返す。
- `.section-title` の直下には装飾の斜線、`.section-title__en`、`h2`、必要な場合のみ `.section-title__description` をこの順で置く。英字と日本語を個別のラッパーで囲まない。実際のh2大見出しと幅に応じた自動配置は `components.html#components` で確認する
- 下層KVの英字・日本語の文字サイズはトップKVと同じルールを使う。共通見本は `docs/components.html` とする
- すべての画面幅で見出しを左上、本文をその下に置き、DOMの読み順と視覚上の順序を一致させる
- 見出し文字は `--section-title-indent` で赤い斜線との間隔を取る。768px未満では `--section-body-indent` を0にし、TOP・下層の見出し直下の説明文、本文内の画像・地図・カード・導線を、斜線の配置基準である `.page-shell` の左余白に揃える。
- 768px以上では `--section-body-indent` を `--section-title-indent` と同じ値にし、本文に見出し文字の左端を使う既存の配置を保つ。全幅で見せる写真や背景は従来の表示枠を使う。
- グレーのセクションに載せる白いコンテンツプレートは768px未満で画面幅まで広げ、左右の内余白に `--page-gutter` を使う。本文とプレート上端の短い罫線は、セクション見出しの斜線と同じ位置を基準にする。見本は [説明文付きの見出し](components.html#sample-ja-heading) と [本文と画像](components.html#sample-feature-title) を参照する。
- 本文領域の標準最大幅には `--content-narrow` を使用し、モバイルでは利用可能幅をそのまま使う。写真・一覧・地図などは `.content-section__body--wide` でページ本文幅まで広げ、文章は必要に応じて `.content-section__body--editorial` または `.content-section__body--readable-copy` で行長を抑える
- セクション間は罫線を置かず、共通の上下余白で区切る

### Business Detail Pattern

- 事業内容ページの4事業は「共通見出し、メッセージ、説明文、写真、中見出し『事業内容』、アイコン項目」の順序で統一する。写真と中見出し＋一覧を `.content-groups` でまとめ、写真下から中見出しまでをPC48px／SP32pxとする。説明文から写真までの余白はPC24px／SP16pxとする。画像の枠・構図は維持する。見出しと一覧の左端は写真に揃える。
- 現在は対応写真が各事業1枚のため、`.business-media` で静止表示する。同一写真を複数枚のスライダーとして繰り返さない
- 4事業のコンテンツ領域は共通してページ本文幅まで使う。リード・説明文の読み幅は維持し、写真・対応項目の一覧を広く見せる
- `.business-media` はSPで4:3、768px以上で2:1の表示枠を使い、最大幅は `--content-max` とする。画像は `object-fit: cover` で収める
- 各事業につき複数の意味の異なる写真が揃った時点でのみ、ページネーションと自動再生を伴うスライダーを新設する
- `.business-capability-grid`：対応範囲を線画アイコンと短い項目名で表示する。現在の4事業の項目数は順に4・6・5・6。`--four` はPCで2列×2行、`--six` は3列×2行、`--five` は上段3項目・下段2項目を左揃えにする。5項目の上段3番目にも下罫線を残し、段の境界を揃える。汎用の `--three` は3列に対応する
- アイコン付き一覧の実物見本は `components.html#sample-icons-four`、`#sample-icons-five`、`#sample-icons-six`。事業内容と同じSVG・クラス・表示アニメーションを使用する。「パフォーマンス出演」は既存のメガホンSVGを使う。
- 中見出しと一覧は `.content-group.content-group--major` 内に置く。見出しは `.content-group__title`、項目名は `.business-capability-grid__label`。事業ページは事業h2→事業内容h3→項目h4、見本は説明h3→事業内容h4→項目h5とし、文字の役割はタグと切り離す。項目名は従来どおり16px・700・1.5。中見出し後の余白は第2・9章の共通ルールを使い、一覧の単独時の上marginを加算しない。
- SPではアイコン項目を1列、768px以上では2列、1024px以上では項目数に応じた列数へ展開する。5項目のタブレット表示では末尾が2列分を使う
- セクション内部の構造は統一しつつ、基本背景と補助背景を交互に使用してページ全体のリズムを保つ
- 角丸や強い影は使わず、既存の罫線、余白、赤いアクセントのルールを継承する

### Page Memory Point

- 下層ページはページごとに強いビジュアル構成を1つだけ設け、すべてのセクションを同じ強度にしない
- 企業概要の `.philosophy-feature` は写真・上下罫線・内部の追加上下余白を使わず、理念を文字組みで見せる。`.page-shell` 内の `.content-section__body--balanced` に入れ、左右に `--section-body-indent` を取る。リード・本文の文字仕様は第2章、本文色は `--color-section-title` を使う。1024px以上でリードと本文を2列にする。
- 企業概要の会社概要とアクセスの間に、`.clients-grid` の取引先名テキスト一覧を置く。`ul/li` を維持し、ロゴ画像・リンク・提案用等の注記は表示しない。順序は寒川町／横浜市／兵庫県／株式会社MIXI／株式会社ディー・エヌ・エー／カシオ計算機株式会社／株式会社チャリ・ロト／株式会社XGJ／大正製薬株式会社／レッドブル・ジャパン株式会社／株式会社ムラサキスポーツ／プーマジャパン株式会社／公益財団法人JKA／日本たばこ産業株式会社。法人はこの正式商号を使い、自治体名・ブランド名も確定した表記を維持する。SPは1列、640px以上は2列、1024px以上は3列。共通の16px本文・文字色・余白・細罫線を使い、長い名称も欠けずに表示する。元支給データは資料フォルダーに保持し、見本は `components.html#sample-clients`。
- 事業内容ページは写真枠とアイコン一覧の反復をページ固有の視覚言語とし、背景の交互切り替えで単調さを抑える。写真が各事業1枚の間は静止表示とする
- 写真が未確定の場合も構造は維持し、クライアント支給後に同じ比率で差し替える
- 数字や実績は確定情報がある場合のみ強調し、ダミー数値をデザイン要素として追加しない

### Works / News / Contact / Privacy

- 実績一覧は `.works-list` / `.work-entry` を使用し、SPでは1列、768px以上では2列、1024px以上では3列とする。詳細ページのない実績にはリンクを付けない。カテゴリは「すべて」とExcelの「大会運営/企画」「大会運営」「パーク運営/監修」「パーク監修」「自治体連携」の5種類をそのまま使い、既存のフィルター・ページ送りで絞り込む。1ページ12件を表示し、カテゴリ変更時は1ページ目に戻す。TOPの `.work-panel` と一覧の `.work-entry` は共通データとカード生成処理を使用し、写真の表示比率は4:3で揃える。Excelにない説明は追加しない
- ニュース一覧は `.news-filter` / `.news-index-list` / `.news-pagination` を使用し、1ページ10件を表示する。SP（767px以下）はネイティブのプルダウン、タブレット・PC（768px以上）は従来のボタンでカテゴリを選択する。両UIの選択肢はJSの同じカテゴリ定義から生成し、表示幅を切り替えても選択状態を共有する。カテゴリ変更時は新しい順に並べ、ページ番号を1へ戻す。ページ送りは第16章のNEWS・WORKS共通仕様を使う。SPでも最初・最後への移動手段を維持する
- ニュース一覧の各行はTOPと同じ `.news__item` / `.news__date` / `.news__category` / `.news__arrow` を使い、`news-index-list` は一覧の容器としてのみ使う。日付フォント、本文サイズ、単体矢印、通常カテゴリのホバー色、重要カテゴリの赤い枠・太字を共通化する。矢印は第2章の通常／hover／focus-visibleの行色を継承する。記事詳細のメタ情報も同じ日付・カテゴリ表現（補足14px、重要カテゴリは状態表示として700）を使い、一覧へ戻る導線には `.text-link` を使う。記事詳細は画像を省略可能な本文構造とし、本文から写真まではPC24px／SP16px。PCでは左端を揃えたまま記事ヘッダーと写真の幅で右側の余白を整える。
- 同じ用途の部品はTOPの既存クラス・状態を再利用し、下層ページだけに通常・ホバー・フォーカス状態を作り直さない。背景や情報量が異なる場合だけModifierとして差分を定義する
- モバイルメニューのMENU／CLOSEは、タップ・マウス操作時だけフォーカス枠を非表示にする。Tab・Enter・Space・Escape・矢印キー操作では共通のfocus-visible表示に戻す。開閉時のフォーカス移動は維持し、画面幅やタッチ対応の有無だけで枠を無効化しない。
- 現在の静的試作ではTOPのお知らせ本文と一覧の仮データは別管理であり、見た目の共通化だけでは記事内容・カテゴリ・リンク先は同期しない。本番CMS化時は同じ記事データから両画面を生成する
- ニュース一覧・詳細とお問い合わせ入力の本文領域は共通の左インデントを維持し、右側にも同じインデントを置いて左右の余白を対称にする。お問い合わせ確認・完了は既存の中央配置と左右対称の余白を維持する。記事本文の段落だけは可読性のため最大行長を維持する
- お問い合わせは `.contact-steps` / `.contact-form` / `.contact-confirm` を共通構造とし、入力・確認・完了でステップ表示と見出しの書式を共用する。プライバシーポリシーの個人情報の取り扱いへ新規タブでリンクする
- お問い合わせと求人応募の完了では、先行する `.contact-steps` の下marginだけで完了見出しまで48／32pxを確保する。見出しから説明文までは中見出し後の24／16px。
- お問い合わせの入力・確認・完了間は各セクションタイトルのアンカーへ移動し、固定ヘッダーの下にタイトルを表示する。フォームの外枠線は使わず、内側の項目区切りだけを残す。各CTAはトップページと同じ `.action-button` をリンク・ボタンの両要素で共用する
- 写真KVは既存の `.page-hero--image` を使用する。お問い合わせは鳥瞰写真、プライバシーポリシーは広島パーク写真を背景とする
- 実績KVは先読みした表示専用の軽量WebPを使い、SPとそれ以上の幅で適切な画像を選ぶ。本文写真と同じ撮影素材でもKV表示用に最適化してよい
- 現段階のニュース記事、フォーム遷移、完了画面はGitHub Pages用の静的試作である。CMS連携、実際の送信、個人情報保護方針の確定文言は本番構築時に別途実装・確認する

### Definition List

- クラス：`.definition-list`
- 会社情報や仕様など、項目名と値の組み合わせに使用する
- HTMLは `dl`、`dt`、`dd` を使用する
- モバイルは縦積み、タブレット以上は項目列と内容列へ分ける
- タブレット以上の項目列は最大10remとし、内容列との間隔を過度に広げない

### Map Embed / Access Card

- クラス：`.map-embed`、`.access-information`、`.access-card`
- 企業概要は住所欄を含む地図の下、出店募集は計画地の本文の下に「主な交通手段」を置く。どちらも `.content-groups` が中見出し前の48／32pxを取り、交通カードの上罫線までは `.access-information__list` が中見出し後の24／16pxを取る。電車・車は1280px以上で2列、それ未満は1列。
- 地図は住所を併記し、外部のGoogleマップを開けるテキストリンクを設ける
- `iframe` には内容を説明する `title` を付け、モバイルで横溢れしない幅にする
- 交通案内は手段ごとにカードへ分け、英字種別、日本語見出し、経路・目安時間の順に記載する
- 案内文はクライアント原稿に従う。経路・運行内容・所要時間の補足を推測して追加しない。電車・車の説明本文は `--color-section-title` を使う
- 交通案内と説明カード（`.feature-cards`）は、細い罫線、背景の塗りなし、内余白、説明文の色を共用する。複数列では外枠と区切り線でつなげ、1列では横罫線で区切る。英字ラベルは `.card-label` を共用し、赤い四角を添える。説明カードは英字ラベル、日本語の見出し、本文の順に配置する。
- 768px以上896px未満の3列説明カードでは、見出しを21pxに揃える。長い中見出しの `.content-group__title--long` は、768px未満で18pxから元の見出しサイズまで調整する。

### Directional Symbols

- 丸ボタン内の右矢印は空の `.ui-arrow-icon` を使い、疑似要素で描画する
- NEWSや募集導線の単体矢印は `.ui-arrow-glyph` を併用する
- 外部リンクは `.ui-symbol.ui-symbol--external` と「↗」記号を使う。PDFは `.ui-download-icon` のSVGを丸囲み内に置き、下矢印とその下の短い水平線で示す。ページ内リンクは `.ui-arrow-icon--down` とし、PDFの記号とは区別する
- 丸ボタン内の矢印はフォント文字を使わず、水平線と矢尻を疑似要素で幾何学的に中央配置する
- NEWSや募集導線のフォント記号は視覚上の中央に合わせて光学補正し、個別のpaddingで調整しない
- 無効ボタンの「—」には矢印用の補正を適用しない

## 5. モーション

- ページ入場はタイトル、斜線、下端ラインの順に短く表示する
- 基本は `opacity`、`transform`、`clip-path` を使用する
- ホバーと入場モーションを同時に過剰化しない
- ファーストビューは `[data-page-hero-reveal]`、通常セクションは `[data-title-reveal]` を使い分ける
- 主要な画像・地図・アイコン一覧は `[data-content-reveal]` を使用できる
- 画像主体の要素は `data-content-reveal="media"` とし、短いクリップ表示と移動を組み合わせる
- コンテンツ全体へ一律に付けず、写真、地図、アイコン一覧など視覚要素を優先する
- 文章のみのパネルや会社情報表はアンカー移動時に空白化させず、原則として即時表示する
- `prefers-reduced-motion: reduce` では即時表示する

## 6. レスポンシブ基準

- 基本スタイルはモバイル向けに記述する
- 2カラム化は内容が無理なく収まる幅を基準にする
- 最低確認幅：320px、375px、767px、768px、1024px、1440px
- 見出し、定義リスト、地図、ナビゲーションの横溢れを確認する
- クリック・タップ領域は44px以上を維持する

## 7. ページ作成手順

1. `company/index.html` を下層ページの基準テンプレートとして使用する
2. Page Heroの英字と日本語タイトルを変更する
3. Content Sectionを必要な数だけ配置する
4. 情報の種類に応じてDefinition List、Split Contentなどを組み合わせる
5. ページ固有CSSを追加する前に、共通部品のバリエーションで解決できるか確認する
6. 新しい再利用部品を追加した場合は本書へ構造と利用条件を追記する

## 8. 現在の適用ページ

- トップページ：`index.html`
- 下層ページ基準：`company/index.html`
- 事業内容ページ：`business/index.html`
- 実績一覧：`works/index.html`
- ニュース一覧・詳細：`news/index.html`、`news/sample-news/index.html`
- お問い合わせ入力・確認・完了：`contact/index.html`、`contact/confirm/index.html`、`contact/complete/index.html`
- プライバシーポリシー：`privacy-policy/index.html`
- 採用情報・求人応募：`recruit/index.html`、`recruit/apply/index.html`、`recruit/apply/confirm/index.html`、`recruit/apply/complete/index.html`
- 飲食横丁・カフェ出店募集：`arkgarden-recruit/index.html`。
- 共通部品確認：`docs/components.html`

## 9. 本文幅と共通部品の運用

### 本文幅の使い分け

- 説明主体の短い内容は標準幅で右側の余白を残し、写真・地図・一覧・情報表・工程は `.content-section__body--wide` でページ本文幅を使う。全幅は画面端までの意味ではなく、`.page-shell` と共通余白の内側を指す。
- `--wide` は `--copy-max: 100%`。文章の行長を制限する場合は `--editorial`（42rem）または `--readable-copy`（段落だけ58rem）を併用する。大見出し・写真・情報表まで狭めない。
- TOP・下層の見出し直下の説明文、リード、本文、カードや工程の案内文には共通で `text-wrap: pretty` を使う。リードの書体と字間は第2章の仕様に従う。
- 施設名・大会名・募集日時・文末など、途中で切れると読みづらい語句は `span.text-phrase` でまとめる。現在の行に収まれば続けて表示し、収まらなければまとまりごと次の行へ送る。まとまりが表示欄より長い場合は内側で折り返す。例は [TOPの出店募集の見出しと説明文](components.html#sample-ja-heading) と [本文幅の見本](components.html#sample-copy-width) を参照する。
- 会社情報は標準幅、理念は `--balanced`、取引先・アクセスは `--wide`。事業内容は `.business-detail` が本文を広げ、説明文の読み幅を維持する。
- 採用のカード・写真・表・工程は `--wide`。WORK STYLE・WORKは `--readable-copy` を併用する。出店募集ページは写真・図面・表に広幅を使う。
- ニュース本文は左右のインデントを対称にする。お問い合わせ・求人応募の入力・確認・完了は最大68remを共用する。
- 実物見本：`components.html#sample-copy-width`。

### 小見出し・ボタン

- `.content-groups` は関連項目の容器。内容の後に見出しを伴うまとまりが続くときは、後続する見出しの役割に応じた上余白を使う。通常の間隔はSPで `--space-xl`、PCで `--space-2xl`。
- 本文・リード・施設名などに続く写真や、本文に続く紹介カードへの余白は `--space-before-media`（PC24px／SP16px）を使う。 `.content-groups` 内では、横並びの写真・紹介カード・公園のパースの直前に適用する。
- `.content-group` と `.content-group__title` は見出し＋内容の組。通常は第2章の小見出し仕様を維持する。中見出しとして使う場合だけ親へ `.content-group--major` を付ける。Noto Sans JP、PC32px／SP24px・700・1.35、後続24px／16px。赤い斜線や縦線は付けない。
- 共通CSSはローカル変数 `--content-group-title-size / -weight / -line / -after` で役割別トークンを選ぶ。`.content-group` が小見出し値を初期化し、`--major` が中見出し値へ切り替える。入れ子の通常グループは小見出しへ戻り、グループ外の既存タイトルも従来値を維持する。文字指定やページ専用CSSを複製しない。
- 各グループ内では見出し直後の要素のmarginで所定の距離を取る。事業のアイコン一覧が単独で持つ上margin56pxは、この既存の隣接要素ルールで24px／16pxへ置き換わる。写真から中見出しまでの距離は、外側の `.content-groups` 内のグループ境界で指定する。
- 実使用先は事業内容4事業とアイコン一覧の見本3点。採用情報・飲食出店募集の既存 `.content-group` は小見出しのまま維持する。募集要項の注記と個別職種も別グループで関係を示す。
- PDFは `.action-button.action-button--outline` と `.ui-download-icon` を共用する。実URL、`download` 属性、資料を区別できる読み上げ名を付ける。
- 共通ボタンの非活性時は「採用サイト準備中」と同じ罫線・文字色・アイコン背景を使う。CSSは `.action-button--disabled` と `.action-button:disabled` で共用し、ボタン全体の透過はかけない。
- `.garden-container__actions` はTOPの出店募集ボタン、募集ページの補足ボタン、暗色ボタンの見本で使う。共通 `.action-button` を中央揃えで横に並べ、利用可能幅で自然に折り返す。文字は1行を保ち、丸矢印は右端に揃える。
- TOPの出店募集ボタンには `.garden-container__actions--compact` を併用する。768px未満ではボタン同士を8px、ラベルとアイコンを4px空け、ボタンの左内余白を12px、アイコンを32pxにする。文字サイズとボタンの高さは共通値を使い、収まる幅では横並び、足りない場合は同じ幅で縦に並べる。
- 募集条件とスケジュールの下では `.garden-container__action-group` を使い、上段中央に応募状況の共通ボタン、16px下の `.garden-container__actions` に「詳細資料PDF」「お問い合わせ」をこの順で並べる。見本も同じ組み合わせを使う。
- フォーム等の `.contact-actions` は中央配置。お問い合わせと求人応募の確認・完了画面では、共通の `.action-button` の寸法を使い、2つのボタンが収まるときは横並び、幅が足りないときは縦に並べる。主要ボタンと補助リンクの組み合わせにはSPで2列表示の `--mixed` を使える。
- お問い合わせと求人応募の完了画面では、見出し・説明文・ボタン群を `.contact-complete` にまとめる。説明文からボタン群までは `.contact-actions` の `--space-xl`（40px）を使い、ボタン群からセクション末尾までの余白は `.content-section` が持つ。
- アンカー先は `.content-anchor` を使い、固定ヘッダーを避ける。確認画面からの戻るボタンは「修正する」に統一する。

### 工程・添付・開閉

- `.detail-feature` は本文と写真の2要素。768px未満は縦、以上は等幅2列。通常写真は4:3、図面は `--contain` で切り抜かない。採用案内のパース画像には `.garden-entry-cta__media` を使う。
- `.process-list` は意味のある順序を持つ工程の `ol/li`。768px未満は工程を縦に並べ、768px以上は工程全体の3列配置を維持する。各liはPC/SPとも番号の左列と見出し・本文の右列に分ける。番号列は工程番号トークンの幅、列間は `--space-md`。番号は上揃えで2行分の領域に置き、見出しが複数行でも本文は右列の次行へ続ける。見出しから本文までは共通の `--type-heading-sm-after` のみを使い、row-gapを加算しない。番号下のmarginは0。番号の文字仕様は第2章、小見出し・本文の文字値も維持する。
- 各liのalign-contentはstartにし、隣の工程が長文でも見出しと本文の間隔を広げない。上罫線とその内側padding、工程間の `--space-xl` は維持する。DOMの順序とol/liは変更しない。見本・採用ページとも `subpage.css` の同じ指定を使う。
- `.attachment-control` はファイル入力・選択名・取り消しをまとめる。未選択をエラー色にせず、長いファイル名を折り返す。
- 添付UIは `subpage-components.js` が管理する。フォーム側は `attachment:restore` の `detail.name` で保存名を復元し、`data-attachment-name` で確認用の名前を取得する。共通JSをフォームJSより先にdeferで読む。ファイル本体は保存・送信しない。
- 開閉は共通JSで高さを400msで伸縮し、連続操作時は現在の高さから反転する。閉じる途中の回答は操作対象外、動きを減らす設定では即時切り替えとする。詳細モーダルは使用しない。
- 実物見本：`components.html#sample-part-5`、`#sample-form`、`#sample-process`、`#sample-vendor-conditions`。

## 10. 採用情報・求人応募

### 構成・素材

- 施設の表記は「寒川町相模川一之宮公園（仮称）」「寒川町ストリートスポーツパーク（仮称）」に統一する。画面では `small.facility-name-note` を使って「（仮称）」のみを小さくし、注記の途中で折り返さない。ページのタイトル・説明・画像の代替テキストには「（仮称）」を文字として記載する。Excel正本の歴史的な実績名、既存URL、識別子、素材ファイル名は引き続き使う。
- 募集区分は公園の社員・アルバイトと、スポーツパークの受付社員・運営管理社員／BMX FLATLAND・SKATEBOARD STREET講師／アルバイト・清掃スタッフの3件。
- 本サイトで詳細と応募を管理するのは公園。両施設はTOP・採用ページ・見本で施設名の下、写真の上に「2027年春頃募集開始予定」を表示する。正式な外部URL受領までは各カードを「採用サイト準備中」とし、公園のフォームや架空URLへ接続しない。
- TOP・採用ページ・見本は `.recruit-facilities` 内に2つの `.recruit-facility` を置く。各施設の直下に施設名を含む `.page-shell.recruit-facility__inner`、施設写真 `.recruit-facility__perspective`、募集案内を含む `.page-shell.recruit-facility__inner` を順に置く。施設名と募集案内は共通の本文位置に揃える。
- 公園とスポーツパークの施設ブロックは、大見出しを含む親セクションの白背景を共有する。横幅いっぱいの背景は親セクションが持ち、施設名と募集案内は各施設内のpage-shellで揃える。
- 施設名は中見出し、募集見出しは小見出し、説明は本文の既存トークンを使う。施設名と募集見出しは共通CSSのtext-wrap: balanceで自然改行を均し、強制改行や文字縮小は加えない。募集開始時期の `.recruit-facility__schedule` は募集カードと同じ本文の色・文字指定を使い、施設名からは `--type-heading-md-after`（PC24px／SP16px）を取る。施設名または募集開始時期から写真までは写真の上マージン `--space-before-media` でPC24px／SP16px、写真から募集案内までは写真の下マージン `--space-xl` で40pxを確保する。施設内の親gapと見出しmarginは0。募集見出し→説明はcopyのgapでPC16px／SP12px、バナー→copyとcopy→ボタンは24px。最初の施設名までは大見出しの下余白、施設間は中見出しの上余白に `--space-md`（16px）を加え、PC64px／SP48pxとする。前の施設の下端はPC24px／SP16px、後の施設の先頭から見出しまではPC40px／SP32px。最後の施設の下端には中見出しの上余白PC48px／SP32pxを施設の背景内に取り、採用セクションの末尾に重ねて加えない。
- 施設名と募集案内を包む `.page-shell.recruit-facility__inner` は、左余白に `--page-gutter` と共通の `--section-body-indent` を使う。768px未満では左右を `--page-gutter` に揃え、768px以上は大タイトルの英字開始位置を基準にする。
- 施設写真は画面幅いっぱいに表示し、TOPのCOMPANYと出店募集にも使う `.photo-cta` と最小高さの指定を共用する。768px未満は `clamp(22rem, 110vw, 28rem)`（幅390pxで429px）、768px以上960px未満は `clamp(28rem, 138vw, 36rem)`、960px以上は `clamp(28rem, 42vw, 38rem)` を使う。施設写真は `object-fit: cover` で中央を基準にトリミングする。募集案内は本文幅のグリッドを使う。
- `.photo-cta` はTOPのCOMPANYと出店募集の写真に説明文と `VIEW MORE` の `.text-link` を重ねる。768px以上は右下に文字を置き、文字の周辺を楕円形のグラデーションで明るくする。768px未満は共通左余白から文字を置き、下部に向かうグラデーションを使う。文字領域の上下余白は768px未満で `--space-2xl`（64px）、768px以上で `--space-3xl`（96px）。
- TOP・採用ページ・見本の施設写真は、公園には `assets/images/recruit/ark-garden-recruit-perspective.webp`、スポーツパークには `assets/images/media/samukawa-street-sports-park-interior.webp` を使う。altには各施設名と写真の内容を記載する。施設写真は画像だけを表示する。
- 各募集カードは `.recruit-opening` 内の募集バナー→`.recruit-opening__copy`（見出し・既存説明）→既存のボタン／準備中spanの順。768px未満はカードのボタンを中央に揃え、見出しと説明文を左に揃える。公園の1件だけ `.recruit-opening--featured` を使い、768px以上は左バナー・右copy＋ボタン、未満は縦積みとする。社員・アルバイトを別カードへ分割しない。
- スポーツパークは `.recruit-facility__layout--park`。768px未満は1列、768〜1279pxは2列、1280px以上は3列。複数列では各カードを3行のsubgridにし、バナーの上下端・見出し開始・ボタン位置を同じ行で揃える。copy内部は小見出し後の共通gapを維持し、文章量の差はcopyの共有行の余白で吸収する。固定高・行数制限・省略・個別縮小は使わない。
- 募集バナーの表示枠は16:10、背景透明。`.recruit-opening__media img` は幅・高さ100％、`object-fit: cover`・中央配置とし、通常時は縮小せず枠いっぱいに表示する。画像のズームは募集カード `.recruit-opening` のhover判定を使い、hover可能・fine pointer・`prefers-reduced-motion: no-preference` の場合だけscale(1.035)へ拡大する。画像だけを `--dur-nav`・`--ease-out` で滑らかに往復させ、枠はoverflow: hiddenで固定する。WORKSと同じ既存のアニメーション定義へセレクターを追加し、既存用途の挙動は変えない。動きを減らす設定とタッチ端末ではズームを適用せず、旧縮小値は復元しない。通常時は16:10の文字入り素材4点を全体表示する。講師の文字入りバナーはTOP・採用ページ・COMPONENTSの募集カードで共用し、採用・求人応募のKVは文字なしの元画像を使う。
- TOPの公園リンクは `recruit/#garden-careers`、採用ページ内は `#garden-careers`、見本は `../recruit/#garden-careers` を維持する。スポーツパーク3件は操作できない準備中spanとし、外部URL等を新設しない。
- 旧 `.recruitment-*`、旧公園専用layout・番号・写真キャプションの指定は、HTML・JSの参照がないことを確認して整理した。施設名と職種の文字指定、カード配置を共通部品へ集約する。募集バナーのhover拡大は上記の共通アニメーション条件で管理し、通常表示を縮小しない。
- 本文の順序は募集区分→WORK STYLE→WORK→FLOW。WORK STYLEは会社紹介と働く環境、WORKは仕事内容・人物像・募集要項、FLOWは応募→面接→採用発表。
- WORK STYLEの会社紹介とCOMPONENTSの会社紹介見本では、`.detail-feature` 内の本文から写真までの縦間隔に、768px未満で `--space-before-media`（16px）を使う。768px以上は横並びで列間64px。
- WORK STYLE・WORKの内容は支給「採用情報_公園.pdf」に基づく。根拠のない働きやすさや条件を創作せず、給与・人数等の「（仮）」を保持する。
- WORK STYLEのリードは「公園の日常と、<br />地域のにぎわいを支える。」。右の画像は採用ページと見本で `assets/images/recruit/ark-garden-recruit-perspective.webp` を共用する。
- 公園の求人バナーは `recruit/ichinomiya-park-staff.webp`。スポーツパークの受付・運営は `recruit/samukawa-street-sports-park-operations.webp`、講師は `recruit/staff-instructor-banner.webp`、アルバイト・清掃は `recruit/samukawa-street-sports-park-cleaning.webp`。
- 採用メイン・求人応募3画面のKVは `recruit/staff-instructor-cleaning.webp` を共用。`.page-hero--image-top` の現行位置は `36% 34%`。
- WORK STYLE・WORK・FLOWの末尾に求人応募のボタンを表示する。募集開始までは「2027年春頃募集開始予定」の無効ボタンを表示し、受付開始後は「求人応募フォームへ」から入力画面へ接続する。
- 実物見本：`components.html#sample-recruit`、`#sample-feature`。

### 求人応募の静的試作

- 必須は氏名・メール・希望職種・志望動機・履歴書添付・個人情報同意。電話番号と職務経歴は任意。現行フォームの希望職種は試作用で、WORKの最新職種との同期が残っている。本番では条件と照合して確定する。
- `recruit-application.js` の保存先は `ark-garden-recruitment-preview`。お問い合わせは `ark-contact-preview` を使い、互いの保存内容を変更しない。
- 入力・確認・完了は現在それぞれ専用HTML。各本文アンカーへ遷移し、確認から修正に戻れる。実送信は行わない。
- 履歴書は名前だけを保持する。確認から戻る場合の仮必須判定を本番のファイル検証として流用しない。
- 確認画面へ直接アクセスし有効な入力がない場合は入力へ案内し、完了時は求人応募データだけを削除する。

## 11. 飲食出店募集

### TOPと内部導線

- ヘッダー・スマホメニュー・フッターの「飲食横丁/カフェ出店募集」と、NEWS先頭の固定告知「募集概要を見る」は `arkgarden-recruit/` の先頭に接続する。固定告知の仕様は第18章を参照する。
- TOPの飲食出店募集は `.section-title--ja-only.section-title--long` で「寒川町相模川一之宮公園（仮称）」を表示し、募集内容を直下の説明文に記載する。狭い幅では「寒川町相模川」「一之宮公園（仮称）」の区切りで折り返す。
- TOPの紹介写真は `assets/images/media/ark-garden-dining-evening-perspective.webp`。出店募集ページのKVでも共用する。20ft・40ftの写真と共通ボタンは第19章を参照する。

### 詳細ページ

- `arkgarden-recruit/index.html` のKVは日本語の主見出し「寒川町相模川一之宮公園（仮称）」に続けて、「飲食横丁出店募集」「カフェ出店募集」を副見出しとして各1行で表示する。背景にはTOPの紹介写真と共用する `assets/images/media/ark-garden-dining-evening-perspective.webp` を使う。本文は「コンセプト」「他公園に無い強み」「飲食横丁/カフェ」「アクセス」「スケジュール」の順。
- コンセプト・強み・アクセスの本文は11月の支給資料に基づく。コンセプトのリード直後は共通の `--type-lead-after` を使う。本文は1つの `.content-section__copy` にまとめ、文のまとまりを `<br>` で改行する。本文の下に公園全体の俯瞰パース `assets/images/media/park-masterplan.webp` を1枚表示する。既存の `.rental-area__media` を使い、本文領域全幅で表示する。上端の黒帯を除くため、`.rental-area__media--masterplan` で元画像の上7px分を表示範囲から外す。強みの3項目は `.feature-cards` と既存の `.content-group` を使い、第4章の交通案内と罫線・内余白を揃える。768px以上は横3列、未満は縦並び。強みのカードの下には `.detail-feature` で芝生広場とテラスのイメージ `assets/images/arkgarden/strengths-lawn-terrace.webp`、夕暮れの飲食横丁のイメージ `assets/images/arkgarden/strengths-evening-food-stalls.webp` を順に表示する。その下に別の小セクションとして、世界トップクラスのストリートスポーツパークと公園の日常についての中見出しと本文を `.content-group--major` で表示する。直下の `.detail-feature--gallery` には、サイトで共用する施設全体・施設外観・屋内スケートパークのパースを、それぞれの名称とともに並べる。768px以上は3列、未満は1列とする。企業概要と出店募集ページの交通案内は電車・車の2項目。出店募集のアクセスでは「寒川町相模川一之宮公園（仮称）」をリードで表示し、電車の経路を「JR相模線 寒川駅から徒歩20分」とする。
- 「飲食横丁/カフェ」では768px以上で20ft・40ftを横並びにし、768px未満は20ftから縦に並べる。各コンテナの見出し直下に `.definition-list` で区画・店舗面積を表示する。20ftは10区画・約7.25㎡。40ftは1区画・約29.7㎡。外観の上余白はPC24px／SP16px、外観から図面はPC16px／SP12pxとする。横並びでは、両方の外観の上端を揃える。外観の下に、20ftは平面図 `arkgarden/container-20ft-plan.webp` を表示する。40ftは `.rental-area__plans` 内に1階・テラス平面図 `arkgarden/container-40ft-ground-plan.webp`、2階席の屋根伏図 `arkgarden/container-40ft-roof-plan.webp` を順に縦に並べる。図面間の間隔は `--type-heading-sm-after` を使う。各図面の表示枠は20ftの平面図と同じ4961:2644とし、2階席の図面は `.rental-area__media-crop` で図と寸法線が収まる範囲を表示する。3点の図面名には `.media-caption.media-caption--plan` を使う。白い図面やページ背景でも白文字とのコントラストを4.5:1以上に保つため、帯は `--color-ink` を70%で重ねる。表示幅が500px以下では図面直下の右端、それ以上では図面の右下に配置する。
- 両方の図面の下に「募集条件」を一つ置き、20ft・40ftそれぞれの「営業時間」「契約形態・契約期間」「定休日」を横罫線付きの `.summary-facts` で表示する。768px以上では左に20ft、右に40ftを配置して対応する行を揃える。768px未満では20ft、40ftの順に縦に並べる。20ftの営業時間は平日17:00〜22:00・土日祝12:00〜22:00。40ftは平日10:00〜19:00と土日祝10:00〜19:00を別々の行で表示する。運営委託契約・3年間と定休日の月曜日は両方に記載する。
- スケジュールは `.schedule-timeline` の縦型3段階・13工程。768px以上は日付・節点・工程の3列、未満は日付を工程の上に表示する。募集開始の予定は2027年2月頃。全日程は予定として扱う。
- 「飲食横丁/カフェ」の募集条件の下とスケジュール末尾に、第9章と同じ2段の応募ボタン群を配置する。受付開始まではTOPと同じ「2027年2月頃募集開始予定」の無効ボタンを使う。受付開始後に「応募フォームへ」を正式な応募URLへ接続する。PDFは20ft・40ft共通の1本。正式資料の支給までは `assets/documents/arkgarden/vendor-details-demo.pdf` を `ダミー.pdf` としてダウンロードできるようにする。「お問い合わせ」は `contact/?type=vendor#contact-form-section` に接続し、「飲食出店募集について」を初期選択する。入力済みの他項目は復元する。
- 見本は `components.html#sample-vendor-conditions`、`#sample-vendor-actions`、`#sample-schedule`。

## 12. 更新時の確認

1. 既存HTML・CSS・JS、クライアント原稿、最新のユーザー指定を確認し、再利用を優先する。新しいCSS・JS等が必要な場合は内容・理由・対象ファイルを編集前に伝える。
2. 変更範囲外と未コミットの作業を保持する。`docs` の更新だけならサイト本体を変更しない。
3. 共通部品を変えたときは `components.html` と使用ページを320 / 375 / 767 / 768 / 1024 / 1440pxで確認する。
4. リンク先・画像・DOM内IDと読み上げ名、通常・hover・focus-visible・disabled、動きを減らす設定を確認する。
5. WORKSは正本Excel・共通データ・素材対応表を照合し、31件・5カテゴリ・12/12/7件・TOP最新6件の順序・クレジットを確認する。
6. フォーム変更時は必須検証・添付・確認・修正・完了・直接アクセスと、別フォームの保存データへの影響を確認する。
7. 日付の古さや参照の有無だけで資料を削除しない。役割と内容の重複を確認し、過去案が現行ルールと競合する記述だけを整理する。

## 13. 文字の分類と既存クラスの対応

HTMLと `works.js`／`subpage-content.js` が生成する要素の役割を示します。

| 掲載箇所 | 文言例 | 既存クラス・生成元 | 分類 | 適用する共通ルール | 例外の有無 |
| --- | --- | --- | --- | --- | --- |
| TOP・全下層のセクション開始 | BUSINESS／事業内容 | `.section-title__en`、直後のh2 | 大見出し | 英80/48、日本語32/24、後続48/32 | なし。長文は自動縦積み |
| TOP採用・採用ページ | 寒川町相模川一之宮公園（仮称）／寒川町ストリートスポーツパーク（仮称） | `.recruit-facility__name` | 中見出し | 32/24・700・1.35、後続24/16 | なし。長い名称は折り返す |
| TOP採用・採用ページ | 受付社員・運営管理社員 募集 | `.recruit-opening__copy h4` | 小見出し | 24/20・700・1.5、後続16/12 | なし。PCの個別縮小を撤去 |
| 公園の採用カード | 社員・アルバイト募集 | `.recruit-opening--featured .recruit-opening__copy h4` | 小見出し | 24/20・700・1.5、Noto Sans JP | なし。Antonio・600・固定の最小高を撤去 |
| 採用・飲食出店の内容小区分 | 働く環境／公園運営マネージャー | `.content-group__title`（h3/h4） | 小見出し | 24/20、後続16/12 | 主区分を中見出しにする判断は個別工程 |
| 企業概要の交通案内 | 主な交通手段 | `.access-information h3` | 中見出し | 32/24、後続24/16 | なし |
| 交通手段のカード | 電車でお越しの方 | `.access-card h4` | 小見出し | 24/20、本文まで16/12 | なし |
| 事業・採用・出店 | ライダーが育つ「場」をつくる | `.content-section__lead` | リードコピー | 32/24・700・1.65、後続24/16 | なし。h要素へ変えない |
| 企業理念 | ストリートの「居場所」を、未来へつなぐ | `.philosophy-feature__lead` | リードコピー | 32/24・700・1.65 | 共通リード。2列レイアウトは維持 |
| 通常の説明文章 | 園内の巡回や安全確認… | `.content-section__copy` | 本文 | 16・400・1.8 | なし。複数段落間は既存内容間隔 |
| 理念本文 | 私たちは、BMXや… | `.philosophy-feature__copy` | 本文 | 16・400・1.8 | 既存の文字色を維持 |
| 採用カードの説明 | 日々の運営を支える社員… | `.recruit-opening__copy p` | 本文 | 16・400・1.8 | なし |
| 写真に重ねる説明 | 現場で培った知見を生かし…／飲食横丁・カフェの出店区画や募集条件をご案内します。 | `.photo-cta__content > p` | 本文 | 16・400・1.8 | `VIEW MORE` を本文下に置く |
| TOPのコンテナ名 | 20ftコンテナ | `.garden-container h3` | 小見出し | 24/20、写真まで24/16 | 写真前の共通余白を参照 |
| 交通案内の経路 | 寒川駅より徒歩約30分 | `.access-card h4 + p` | 本文 | 16・400・1.8 | なし。14pxから変更 |
| 地図の所在地 | 神奈川県高座郡寒川町… | `.map-embed__meta p` | 本文 | 16・400・1.8 | 外部地図リンクのUI文字は対象外 |
| 取引先名の一覧 | 株式会社ディー・エヌ・エー | `.clients-grid li` | 本文 | 16・400・1.8 | リンク・ロゴ化はしない |
| 通常情報表 | 仕事内容／勤務地 | `.definition-list dt` | 項目ラベル | 16・700・1.5 | なし |
| 通常情報表の説明する値 | 園内の巡回、安全確認… | `.definition-list dd` | 本文 | 16・400・1.8 | 旧一律500・最大18pxを撤去 |
| 募集条件の項目名 | 営業時間／定休日 | `.summary-facts dt` | 項目ラベル | 16・700・1.5 | なし |
| 募集条件の値 | 運営委託契約・3年間 | `.summary-facts dd` | 強調する本文 | 18・500・1.8 | 各コンテナの募集条件に使用 |
| 表の値に付く補足 | 税込・予定／※現住所 | `.definition-list dd span` | 補足・注記 | 14・400・1.6 | span全体が値の場合は個別マークアップを再検討 |
| 出店条件の注意 | BAR、スイーツをメイン… | `.rental-area__note` | 補足・注記 | 14・400・1.6 | なし |
| 募集要項の未確定条件 | 給与・募集人数…は仮条件 | 現行 `.content-section__copy` | 意味上は補足・注記 | 補足として分離する場合は14・400・1.6 | 個別判定待ち。本文クラスのまま16px |
| フォーム入力・確認 | 氏名／メールアドレス | `.contact-form__row > label:first-child`、同span、`.contact-confirm dt` | 項目ラベル | 16・700・1.5 | 必須・任意バッジは状態UIを維持 |
| フォーム確認の値・同意文 | 入力した氏名／同意します | `.contact-confirm dd`、`.contact-form__check` | 本文 | 16・400・1.8 | 入力・送信の試作動作は変更しない |
| 完了画面 | ご応募ありがとうございます | `.contact-complete h3`／p | 中見出し／本文 | 32/24と16、後続24/16 | なし |
| TOPの固定募集告知 | 寒川町相模川一之宮公園（仮称）の飲食出店者募集は、2027年2月頃に開始予定 | `.news-announcement__title` | 小見出し | 896px以上24px、768〜895pxは21px、768px未満は18〜20px。700・1.5 | 写真・日付なし、CMS対象外。第18章参照 |
| NEWS一覧・TOP | ARK LEAGUEの事業内容を… | `.news__item p`（HTML・JS生成） | 本文 | 16・400・1.8 | 既存の1行省略は用途別に維持 |
| NEWS重要項目 | パーク運営・イベント企画に関するご相談… | `.news__item--important p` | 強調する本文 | 18・500・1.8 | カテゴリの赤い枠を維持。矢印は通常黒、hover／focus-visibleで赤 |
| NEWS記事タイトル | 記事のタイトル | `.news-article__header h3` | 中見出し | 32/24・700・1.35 | 縦配置はメタ情報から16px。1024px以上ではメタ情報を横に配置 |
| NEWS本文・プライバシー本文 | 個人情報の利用目的… | `.news-article__body`、`.privacy-copy` | 本文 | 16・400・1.8 | なし |
| 記事・ポリシーの本文見出し | 個人情報の取り扱い／第三者提供 | `.news-article__body h4`、`.privacy-copy :is(h2, h3)` | 小見出し | 24/20、後続16/12 | 本文の左端に配置 |
| NEWS日付・カテゴリ | 2026.09.23／イベント | `.news__date`、`.news__category`、`.news-article__meta` | 補足・注記 | 14・400・1.6 | 重要カテゴリの700だけ状態UIの例外 |
| WORKS案件名 | YOKOHAMA URBAN SPORTS FESTIVAL… | `.work-panel__meta h3`、`.work-entry h3`、`works.js` | 小見出し | 24/20・700・1.5、後続16/12 | Excelの改行を表示し、英字と年号や引用符内の名称をまとめる |
| WORKS年・カテゴリ | 2026年／大会運営/企画 | `.work-panel__category`、`.work-entry__category`、`.work-entry__description` | 補足・注記 | 14・400・1.6 | カテゴリ名を項目ラベルと混同しない |
| 画像キャプション・クレジット | 図面名／©Jason Halayko / YUSF | `.media-caption`、`.news-article__media figcaption` | 補足・注記 | 14・400・1.6 | 位置・写真は維持 |
| 添付ファイル・状態通知 | 選択されていません | `.attachment-control__filename`、`.contact-form__status` | 補足・注記 | 14・400・1.6 | 選択・取消ボタンは操作UI仕様 |
| 事業の対応範囲の見出し | 事業内容 | `.content-group--major > .content-group__title`（実ページh3／見本h4） | 中見出し | 32/24・700・1.35、後続24/16 | 共通グループの中見出し版 |
| 事業の対応範囲アイコン | 運営／コミュニティ形成 | `.business-capability-grid__label`（実ページh4／見本h5） | 項目ラベル | 16・700・1.5 | タグに依存せず見た目を維持 |
| 工程の見出し・説明 | 応募／内装・厨房計画 | `.process-list h3`、`.schedule-phase__title`、`.schedule-step__body h4` | 小見出し／本文 | 24/20と16、説明前16/12 | 工程番号・日付・段階内配置は用途別 |

### 用途別のコンポーネント

| 掲載箇所・文言例 | 既存クラス | 表示仕様 | 確認事項 |
| --- | --- | --- | --- |
| TOPメインコピー／Living Culture. | `.hero__title`、`.hero__tagline` | 現行の流動サイズ・行間を維持 | 必要時にKVとして別途調整 |
| 下層ページ名／COMPANY | `.page-hero__title-en`、`.page-hero h1` | 英字は用途別仕様、日本語はPC・SP共通16px（`--text-base`） | KV共通 |
| 日本語の下層ページ名 | `.page-hero__title-ja`、`.page-hero__subtitle` | 主見出しは28〜76px、副見出しはPC・SP共通16px（`--text-base`） | 第4章参照 |
| グローバルナビ・メニュー・フッター | `.global-nav`、`.mobile-menu__nav`、`.site-footer__*` | 操作・サイト案内・ブランド文の現行仕様を維持 | 個別依頼時に検討 |
| 主要ボタン・補助リンク・フィルター | `.action-button`、`.text-link`、`.news-filter`、`.news-pagination` | 操作UIの文字サイズを維持 | 必要時にUI全体で検討 |
| 事業パネル | `.business-panel__*` | PC縦書き等の用途別仕様を維持 | ページ別工程で検討 |
| 工程番号・日付・進行表示 | `.process-list__number`、`.schedule-step__year/date`、`.contact-steps` | 工程番号は第2章の専用32px。日付・進行表示は既存仕様を維持 | 標準本文と別管理 |
| TRAIN／CAR／DAY & NIGHT など | `.card-label` | 交通案内・説明カードの英字ラベル | Antonio |
| 必須・任意・重要カテゴリ | `.contact-form__required/optional`、`.news__category--important` | 小型バッジ・重要状態として現行差分を維持 | 状態UIとして評価 |

### 残るページ別の確認事項

1. 実際のページでタイトルとリードの主従に問題がある場合は、役割の再分類としてページごとに確認する。見本の説明見出しに合わせてリードを小さくしない。現在の `.content-group__title` とリードの組み合わせ（採用情報の「会社紹介」等）は、主見出しか説明ラベルかを判断する対象になる。
2. 採用カードの長い施設名は共通サイズの自然改行を維持した。「寒川町ストリートスポーツパーク（仮称）」は画面幅に合わせて折り返す。専用の縮小・強制改行バリエーションは追加しない。
3. 採用要項の仮条件・長い注記の文章構成は、原稿確定時にページ別に整理する。情報表はdt/dd各16pxを維持する。

## 14. 実部品と見本専用表示の使用先

| 実部品 | 使用ページ・生成元 | 部品見本 |
| --- | --- | --- |
| 英字＋日本語のh2大見出し・自動縦積み | TOP、全下層、`script.js` | 各セクションの見出し |
| 施設名・職種・長い名称の採用カード | TOP、採用情報 | `#sample-recruit` |
| 本文幅・リード・本文 | 事業内容、採用情報、飲食出店募集 | `#sample-copy-width` |
| 本文＋写真 | 採用情報 | `#sample-feature` |
| 取引先名 | 企業概要 | `#sample-clients` |
| WORKSカード | TOP、WORKS、`works.js` | `#sample-works`（同じデータ・描画処理） |
| 対応範囲アイコン | 事業内容 | `#sample-icons-four / five / six` |
| 通常情報表 | 企業概要、採用情報 | `#sample-part-5`、情報表 |
| 出店募集の共通条件 | 20ft・40ftコンテナ | `#sample-vendor-conditions` |
| 説明カード | 他公園に無い強み | `#sample-feature-cards` |
| 固定募集告知 | TOPのNEWS先頭、記事一覧の外側 | `#sample-news-announcement` |
| NEWSのカテゴリ・18px重要項目・長いタイトルの省略 | TOP、NEWS一覧・記事、`subpage-content.js` | `#sample-news`（重要／通常×短文／長文） |
| 共通のページ送り | NEWS一覧、WORKS一覧、`pagination.js` | `#sample-pagination-2-1` ほか、2・3・12ページの先頭／中間／末尾 |
| 応募・PDFボタン | TOP、採用情報、飲食出店募集、フォーム | 共通ボタン・暗色面のボタン |
| 入力・添付・進行表示 | お問い合わせ、求人応募 | `#sample-form` |
| 出店募集のボタン | 飲食横丁・カフェ出店募集 | `#sample-vendor-actions` |
| 出店募集ページへのセクションリンク | TOP | `#sample-vendor-routes` |
| 日付付き工程 | 飲食横丁・カフェ出店募集 | `#sample-schedule` |
| 番号付き選考工程 | 採用情報 | `#sample-process` |
| 標準小見出し | お知らせ詳細、プライバシーポリシー | 記事本文の小見出し、`#sample-policy-copy` |
| 本文内の箇条書き | プライバシーポリシー | `#sample-policy-copy` |

HTMLだけでなく、JSのクラス生成と状態付与を使用判定に含めます。見本専用の説明・比較・枠・配置の全指定は `docs/components.css` に置き、サイトCSSから切り離します。部品の仕様値は第2章を参照し、他のガイドラインでは同じ数値表を複製しません。

## 16. NEWS・WORKS共通のページ送り

### 構造・読み込み先

- 正本の表示処理は `assets/js/pagination.js`。`window.ARKPagination.create(nav, { onChange, scrollTarget })` で生成し、`update({ pageCount, page })` で状態を更新する。既存の `.news-pagination` 名をNEWS・WORKS共通の部品として維持する。見本だけで別のボタンCSSを作らない。
- `news/index.html` は `subpage-content.js` より前、`works/index.html` は `works.js` より前にdeferで読む。`docs/components.html` も同じJSを読み、`data-pagination-total / data-pagination-current` で指定した見本状態を生成する。見本の操作後は状態名と読み上げ用の現在位置も更新する。
- TOPのWORKS表示と記事詳細・フォームにはページ送りがないため、この共通JSは追加しない。`works.js` はTOPの最新6件を従来どおり描画してから一覧の有無を判定する。
- NEWSは10件／ページ、WORKSは12件／ページ。掲載データ、並び順、カテゴリは維持する。カテゴリ変更時は1ページ目へ戻し、絞り込み後の件数から総ページ数を計算する。

### 表示ルール

| 総ページ数 | 操作・番号 |
| --- | --- |
| 1ページ | ページ送りと外側の余白を非表示 |
| 2〜5ページ | 前へ・全ページ番号・次へ |
| 6ページ以上 | 最初へ・前へ・先頭／現在周辺／末尾の番号・次へ・最後へ。離れた番号の間は操作できない「…」 |

- 768px以上は現在±1ページと先頭・末尾、未満は現在と先頭・末尾を使う。番号を重複させず範囲内に収め、現在ページには `aria-current="page"` を付ける。
- 最初へは1、最後へは総ページ数、前後は±1へ移動する。先頭では最初へ・前へ、末尾では次へ・最後へをnativeのdisabledにする。少数ページで使わない最初へ・最後へ以外は、無効でもボタンを残す。
- SPは番号を上段、前方／後方の移動ボタンを下段にまとめる。先頭・末尾の番号や省略記号をCSSで隠さない。全ボタンの操作領域は44px以上。多数ページは番号領域の最小幅を一定にし、端の状態でも移動ボタンが不要にずれないようにする。
- 四角い罫線、現在ページの反転、既存アクセント色のhover、共通focus-visible、無効時の薄色を維持する。丸い表示や青い配色を追加しない。
- `.news-pagination button` の数字はNoto Sans JPを使う。NEWS・WORKS・見本で同じ共通指定を参照する。番号14px、移動ボタン12pxと既存の太さ・行間・余白を維持する。フォームのステップ番号はAntonioを使う。
- ページ変更後は共通処理の `scrollTarget` に指定した一覧へスクロールする。NEWS・WORKSは同じ固定ヘッダー用のスクロール余白を使う。通常はsmooth、動きを減らす設定ではinstantで移動する。NEWS・WORKSは件数と現在ページを安定した `role="status"` 要素で通知する。ボタンを作り直した後も、操作中のボタンまたは現在ページへフォーカスを戻し、画面幅変更でも現在ページを維持する。

### デザイン見本と記事タイトル

- ページ送りの見本は2ページの1／2、3ページの1／2／3、12ページの1／6／12を表示する。1ページの場合も「ページ送りなし」と示す。実際のNEWS・WORKSへ架空の掲載データは追加しない。
- NEWSは重要／通常のお知らせそれぞれに短いタイトルと長いタイトルを置く。カテゴリは14px・1行全文、記事タイトルだけを既存のCSS `text-overflow: ellipsis` で1行省略する。重要項目の18px・500、通常の16px・400を維持する。
- JSでタイトルを切り取らず、DOMには全文を残す。記事詳細の `.news-article__header h3` は折り返して全文を表示し、一覧の省略指定を適用しない。見本用の記事文章は実際の掲載原稿ではない。
- 技術説明、部品の使用先、ファイル対応は本書に残す。クライアント向けの見本へ再掲載しない。

## 18. NEWS先頭の固定募集告知

### 確定した表示仕様

- 部品は `assets/css/style.css` の `.news-announcement`。ラベルは既存の `.news__category.news__category--important` による「重要なお知らせ」、告知文は「寒川町相模川一之宮公園（仮称）の飲食出店者募集は、2027年2月頃に開始予定」、ボタンは黒い共通 `.action-button` の「募集概要を見る」。写真・日付は表示しない。
- 背景はtransparentとし、周囲のNEWSと一体にする。告知専用の白・グレー・ベージュの背景面、ラベルやボタンを囲む四角い背景を設けない。カテゴリの赤い枠と、ボタン本体・丸矢印の既存背景は維持する。
- 外枠は四辺とも `--rule-hair`（1px）・`--color-accent`。ラベルの赤と同じ色を使い、上辺だけを太くしない。TOPでは記事一覧と同じ `.news__content` に置き、左右端を揃える。
- 内余白と文章／ボタンの間は `--space-lg`、ラベル／告知文の間は `--space-md`。記事一覧までは隣接する `.news__list` の上marginで `--space-xl` を一度だけ取る。
- 告知文は第2章の小見出しトークン（PC24px／SP20px・700・1.5）。左揃えで自然に折り返す。専用の流動サイズや、サイト全体のトークン変更は行わない。
- 768px未満はラベル・告知文・ボタンを縦に配置し、768px以上は文章の右にボタンを置く。ボタンは共通の文字・padding・丸矢印を縮小せず、カード全体をリンクにしない。
- TOPの「募集概要を見る」は `arkgarden-recruit/`、見本では `../arkgarden-recruit/` に接続する。

### CMS化と募集終了時の管理

- TOPの固定asideは `.news__content` 直下、`#news-list.news__list` の外側にハードコードする。CMS化で記事ループに置き換えるのは `#news-list` の内側だけ。固定告知を記事件数・新着順・カテゴリ絞り込み・ページ送りに含めない。
- CMS化時は「飲食出店募集のお知らせ」を記事として再掲載し、TOPでの固定告知との重複を避ける。
- 内容変更時は `index.html` の固定asideと、`docs/components.html#sample-news-announcement` の見本を同時に更新し、本章を修正する。見本へ技術説明を表示しない。
- 募集終了時はTOPと見本の固定aside、見本の不要になる見出し・容器を削除する。記事一覧は残し、TOP下部の募集内容・応募導線は別途確認して更新する。下部セクションや画像を自動的に削除しない。関連CSSは全使用先の参照がなくなってから整理する。

## 19. TOP飲食出店募集の写真とリンク

- 20ftは `arkgarden/container-20ft-two-stores.png`、40ftは `arkgarden/container-40ft.webp`。既存の3:2の写真枠を共用し、見出しから写真まではPC24px／SP16px。768px以上は2列、未満は縦に並べる。
- TOPの出店募集パースは `.photo-cta` で短い説明文と `VIEW MORE` を表示し、`arkgarden-recruit/` の先頭に接続する。20ft・40ftの各写真の右下には、細い白の縁取りを入れた黒文字と下線、黒地に白い丸矢印の `VIEW MORE` を重ねる。文字と矢印をまとめて `arkgarden-recruit/#area` に接続する。
- TOPのコンテナ群は紹介画像の下端から最初の見出しまで、小見出し前の32／24pxをpaddingで取る。768px未満の20ftの写真から40ft見出しまでの24pxは行gapが所有する。
- 写真下に「詳細を見る」と応募状況のボタンを1つずつ置く。「詳細を見る」は `arkgarden-recruit/` の先頭へ接続する。応募状況は詳細ページと合わせ、募集開始前は「2027年2月頃募集開始予定」の無効ボタンを表示する。
- ボタンの下の `.route-list` に、出店募集ページの大見出しと同じ順序で「コンセプト」「他公園に無い強み」「飲食横丁/カフェ」「アクセス」「スケジュール」を並べる。各 `.route-item` の行全体を、それぞれ `#concept`、`#strengths`、`#area`、`#access`、`#schedule` に接続する。見出しの変更時はTOPと見本の文言・順序を揃える。
- 各リンクは日本語ラベル、英字見出し、右向き矢印の順で表示し、細い罫線で区切る。768px以上は3列の位置を全行で揃え、未満は日本語と英字を左側に2段で並べる。見本は `components.html#sample-vendor-routes`。

## 20. 背景の割り当て

### ページごとの割り当て

白とグレーの全幅背景は、大見出しで始まるセクションを単位に切り替えます。採用の施設名など、同じ大見出しに属する内容は親セクションの背景に載せます。

| ページ | 内容のまとまりと背景 |
| --- | --- |
| TOP | NEWS白／BUSINESSグレー／WORKS白／COMPANYグレー／RECRUIT（両施設を含む）白／飲食出店グレー／CONTACT白 |
| 事業内容 | 4事業を掲載順に白／グレー／白／グレー |
| 企業概要 | 経営理念白／会社概要グレー／取引先一覧白／アクセスグレー |
| 飲食出店募集 | コンセプト白／他公園に無い強みグレー／飲食横丁・カフェ白／アクセスグレー／スケジュール白 |
| 採用情報 | 募集区分（両施設を含む）白／公園で働くグレー／社員・アルバイト募集白／選考の流れグレー |
| NEWS一覧・詳細、WORKS一覧、問い合わせ・求人応募の入力／確認／完了、プライバシーポリシー | 本文を一つの白いまとまりとして扱う |
| 全ページ・デザイン見本 | フッター黒。明色／暗色の部品見本はそれぞれの用途の背景を維持する |

TOPの WORKS と飲食出店募集には明色用のリンクやボタンを使用します。CONTACTは白背景に黒のボタンを置きます。暗色のボタン見本では専用の暗色用バリエーションを確認できます。
