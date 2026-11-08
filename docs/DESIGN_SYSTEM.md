# ARK LEAGUE デザインシステム

## 1. 役割

本書は、ARK LEAGUEコーポレートサイトで再利用するUI部品の仕様書です。2026-11-07時点の実装を基準とし、過去の案や未実装の構成は現行仕様として扱いません。

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

2026-11-07合意の共通仕様。SPは768px未満、PCは768px以上で、タブレットもPC値を使います。この境界は文字の仕様に適用し、レイアウト用の640／960／1024／1280px等の境界は維持します。表のpxは標準16px設定での表示目標です。CSSではremと単位なし行間を使用し、htmlの基準文字サイズを固定しません。

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

各接頭辞に `-size`、`-weight`、`-line` を付けて参照します。日本語の見出し・リード・本文、通常の情報表示、ページネーションの数字は `--font-body`（Noto Sans JP）を使う。フォームのステップ番号、英字の大見出し・コンセプト文・装飾番号・工程番号（スケジュールの工程番号を含む）・スケジュールの年表示・FAQのQ/A、およびMENU／CLOSE・TOPスライダーの切り替え番号・ACCESS GUIDE／TRAIN／BUS／CARは `--font-display`（Antonio）を維持する。TOPのFAQ導線の英字は第19章のNoto Sans JP仕様を維持する。`--text-*` の既存値は変更せず、ヒーローや操作UIの用途別仕様に残します。

| 後続内容までの距離 | PC | SP | 管理トークン |
| --- | --- | --- | --- |
| 大見出し | 64px / 4rem | 40px / 2.5rem | `--type-section-after` |
| 中見出し | 24px / 1.5rem | 16px / 1rem | `--type-heading-md-after` |
| 小見出し | 16px / 1rem | 12px / 0.75rem | `--type-heading-sm-after` |
| リードコピー | 24px / 1.5rem | 16px / 1rem | `--type-lead-after` |

大見出しはセクションの始まり、中見出しはセクション内の主要なまとまり、小見出しはカード・職種・内容の小区分です。リードは紹介やメッセージの文章で、見出しと同じサイズでもp要素を使います。HTMLのh1〜h6は内容の構造で選び、サイズを理由に階層を変えません。

### 現行の文字部品と余白の所有者

- 大見出しは `.section-heading` 内の `.section-title` を使い、赤い斜線・英字 `.section-title__en`・直後のh2を一組にする。現行サイトのDOMと既存 `script.js` の自動配置を維持する。日本語が英字最終行の右に収まらなければ、JSが `.section-title--stacked` を付けて縦に並べる。このクラスは実行時に使う状態であり、未使用CSSではない。
- 大見出しの後続余白は `.section-heading` のpaddingが所有し、`.content-section__head` も同じトークンを使う。セクション全体の上下paddingや本文プレート内のpaddingとは区別する。
- 中見出しは施設名 `.recruit-facility__name`、交通案内の `.access-information h3`、記事タイトル等の実部品に適用する。小見出しは職種・内容小区分・交通案内・記事本文・ポリシーの実部品に適用する。h要素の数字だけで文字の役割を決めない。
- `.content-group` はgapを0にし、`.content-group__title` 直後の要素のmarginだけで後続余白を確保する。通常は小見出し用 `--type-heading-sm-after`、`.content-group--major` では中見出し用 `--type-heading-md-after`。通常内容間は `--space-lg`、リード直後は `--type-lead-after`。施設・職種カードは既存gridのgapが見出し後の距離を所有する。
- `.content-section__lead + .content-section__copy` と理念の縦積みは共通リード用の後続余白を使う。1024px以上の理念2列のcolumn-gapは既存レイアウトを維持する。
- 情報表は `.definition-list dt` が項目ラベル16px、ddが通常本文16px。主要条件の要約 `.summary-facts dd` と重要なお知らせ `.news__item--important p` は強調本文18px。情報表の値を一律18pxにする別バリエーションは設けない。dd内の補足spanは共通の補足仕様を使う。
- 長い施設名・職種名は現行採用カードの自然な折り返しで確認する。個別に縮小したり、見本だけの特別な改行をサイトの仕様として追加したりしない。
- TOPのCONTACTはCTAを横に置く既存の専用レイアウトで、見出しpaddingを0にし、親のgapで配置する。

### 小見出し・上罫線・工程番号

- `.news-article__body h4` と `.privacy-copy h3` は標準小見出しを使い、赤い縦線・専用の左余白を持たない。直後の段落marginを0にし、見出しの後続余白だけを取る。見出し前の段落との間隔は別の内容間隔として扱う。
- 小見出しから情報表・工程・FAQ等の上罫線までは `--type-heading-sm-after` を使う。情報表・主要条件表・工程・FAQ・詳細アコーディオンの同じ役割の上罫線は `--rule-hair` と `--color-rule` に統一する。表の行内padding、質問行のpaddingは部品内部の別用途として維持する。工程番号下の余白はPC/SPとも使わず、見出しと本文の間隔は小見出しの後続余白で管理する。
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
- 下層ページでは現在ページのリンクへ `aria-current="page"` を付ける
- 下層ページからトップ内セクションへ移動する場合は `index.html#section-id` を使う

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
- `object-fit: cover` を基本とし、画面幅に応じて画像ごとに `object-position` を調整する。ロゴとコピーの可読性はベールで確保し、画像ごとに文字色を変えない
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
- TOPの `.work-panel` は暗色面用。`.works.section.section--dark` と `.section-heading--light` を組み合わせ、明色面の実績一覧は `.work-entry` を使う
- TOPと同じ描画の実物見本は `components.html#sample-works`。データ・画像パスを見本専用に複製しない

### Recruit

- TOP・採用ページ・見本は `.recruit-facilities / .recruit-facility / .recruit-opening` を共用する。施設名→中央の施設写真→募集案内の順序、素材・背景・列数・余白の正本は第10章。
- 採用専用の既存素材は `assets/images/recruit/` を参照し、ページごとに複製しない。仮の施設写真と募集バナーを別要素として扱う。

## 4. 下層ページコンポーネント

### Page Hero

- クラス：`.page-hero`
- 高さ：`--subpage-hero-height`
- 必須要素：`.page-hero__slash`、`.page-hero__title-mask`、`.page-hero__title-en`、`h1`、`.page-hero__rail`
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

### Content Section

- クラス：`.content-section`
- 背景は `.content-section--base` と `.content-section--tinted` の2種類を共通バリエーションとして使用する。採用施設ブロックでは、色だけを共有する `.section-surface--base / --tinted` を使用する。色指定と初期値は `style.css` に集約し、従来の本文プレート・黒い横線・構造グリッド等は `subpage.css` の下層セクション側へ残す。施設ブロックへ装飾付きクラスや `.content-section__body` を付けない。
- `--base` は標準のペーパー色、`--tinted` は同系色の濃度差と右側の部分的な設計補助線でセクションを区切る
- 原則として基本背景と補助背景を交互に使い、ページ固有の任意色や強い装飾を追加しない
- 設計補助線は縦線1本、長さの異なる横線2本、小さな赤い基準マークで構成し、全面反復パターンにはしない
- `--tinted` の本文領域は角丸や影のない白いコンテンツプレートとし、section-titleはプレートの外に残す
- コンテンツプレートは情報をまとめる大きな面として使い、内部の項目を個別の白いカードへ分割しない
- セクション全体の実背景色は `--section-surface` で管理する
- コンテンツの実背景色は `--content-surface` で管理し、前景の罫線部品にも同じ値を使用する
- 設計補助線はコンテンツプレートの背後へ透過させず、周囲の余白部分だけに見せる
- 見出し領域と本文領域を `.content-section__grid` で管理する
- 見出しはトップページと同じ `.section-heading` / `.section-title` を使い、赤い斜線、英字、日本語の順で統一する。文字の値は第2章の役割別仕様を使う
- 英字タイトルと日本語見出しのサイズ・行間・間隔・文字色は共通ルールを使い、個別ページやIDで上書きしない。見出しは親領域の利用可能幅いっぱいを使い、収まる場合は日本語を英字の最終行の右隣に置く。共通スクリプトが親領域の右端と日本語の文字幅を比較し、収まらない場合だけ日本語を英字の下へ左揃えで置く。英字は語の途中で分割しない
- `.section-title` の直下には装飾の斜線、`.section-title__en`、`h2`、必要な場合のみ `.section-title__description` をこの順で置く。英字と日本語を個別のラッパーで囲まない。実際のh2大見出しと幅に応じた自動配置は `components.html#components` で確認する
- 下層KVの英字・日本語の文字サイズはトップKVと同じルールを使う。共通見本は `docs/components.html` とする
- すべての画面幅で見出しを左上、本文をその下に置き、DOMの読み順と視覚上の順序を一致させる
- SPの見出しは `--section-title-indent` で赤い斜線用の余白を確保しつつ、ページ余白との合算が過大にならない値を使う
- 下層ページ本文は `--section-body-indent` で管理し、SPでは追加インデントを付けず、地図・画像・文章をページ本文幅へ戻す
- 768px以上では `--section-body-indent` を `--section-title-indent` に揃え、見出しと本文の共通軸を復元する
- 補助背景の白いコンテンツプレートは、SPでも左右対称の最小内余白を確保する
- 本文領域の標準最大幅には `--content-narrow` を使用し、モバイルでは利用可能幅をそのまま使う。写真・一覧・地図などは `.content-section__body--wide` でページ本文幅まで広げ、文章は必要に応じて `.content-section__body--editorial` または `.content-section__body--readable-copy` で行長を抑える
- セクション間は罫線を置かず、共通の上下余白で区切る

### Business Detail Pattern

- 事業内容ページの4事業は「共通見出し、メッセージ、説明文、写真、中見出し『事業内容』、アイコン項目」の順序で統一する。写真と中見出し＋一覧を `.content-groups` でまとめ、写真下から見出しまでをPC64px／SP40pxとする。写真上の既存余白56pxと画像の枠・構図は維持する。見出しと一覧の左端は写真に揃える。
- 現在は対応写真が各事業1枚のため、`.business-media` で静止表示する。同一写真を複数枚のスライダーとして繰り返さない
- 4事業のコンテンツ領域は共通してページ本文幅まで使う。リード・説明文の読み幅は維持し、写真・対応項目の一覧を広く見せる
- `.business-media` はSPで4:3、768px以上で2:1の表示枠を使い、最大幅は `--content-max` とする。画像は `object-fit: cover` で収める
- 各事業につき複数の意味の異なる写真が揃った時点でのみ、ページネーションと自動再生を伴うスライダーを新設する
- `.business-capability-grid`：対応範囲を線画アイコンと短い項目名で表示する。現在の4事業の項目数は順に4・6・5・6。`--four` はPCで2列×2行、`--six` は3列×2行、`--five` は上段3項目・下段2項目を左揃えにする。5項目の上段3番目にも下罫線を残し、段の境界を揃える。汎用の `--three` は3列に対応する
- アイコン付き一覧の実物見本は `components.html#sample-icons-four`、`#sample-icons-five`、`#sample-icons-six`。事業内容と同じSVG・クラス・表示アニメーションを使用する。「パフォーマンス出演」は既存のメガホンSVGを使う。
- 中見出しと一覧は `.content-group.content-group--major` 内に置く。見出しは `.content-group__title`、項目名は `.business-capability-grid__label`。事業ページは事業h2→事業内容h3→項目h4、見本は説明h3→事業内容h4→項目h5とし、文字の役割はタグと切り離す。項目名は従来どおり16px・700・1.5。中見出し後の余白は第2・9章の共通ルールを使い、一覧の単独時の上marginを加算しない。
- SPではアイコン項目を1列、768px以上では2列、1024px以上では項目数に応じた列数へ展開する。5項目のタブレット表示では末尾が2列分を使う
- セクション内部の構造は統一しつつ、基本背景と補助背景を交互に使用してページ全体のリズムを保つ
- 確認記録（2026-11-08）：320／375／767／768／1024／1440pxで実ページ・見本・既存グループを比較した。共通CSS使用ページを含む48画面条件・612項目を通過し、中見出し・前後余白・左揃え・階層・長文・入れ子を確認。写真の寸法・構図・上余白、アイコン・項目ラベル、採用・飲食出店募集の小見出しは作業前と一致。横溢れ・JS例外なし。
- 角丸や強い影は使わず、既存の罫線、余白、赤いアクセントのルールを継承する

### Page Memory Point

- 下層ページはページごとに強いビジュアル構成を1つだけ設け、すべてのセクションを同じ強度にしない
- 企業概要の `.philosophy-feature` は写真・上下罫線・内部の追加上下余白を使わず、理念を文字組みで見せる。`.page-shell` 内の `.content-section__body--balanced` に入れ、左右に `--section-body-indent` を取る。リード・本文の文字仕様は第2章、本文色は `--color-section-title` を使う。1024px以上でリードと本文を2列にする。
- 企業概要の会社概要とアクセスの間に、`.clients-grid` の取引先名テキスト一覧を置く。`ul/li` を維持し、ロゴ画像・リンク・提案用等の注記は表示しない。順序は寒川町／横浜市／兵庫県／株式会社MIXI／株式会社ディー・エヌ・エー／カシオ計算機株式会社／チャリ・LOTO／X GAMES JAPAN／大正製薬株式会社／Red Bull／株式会社ムラサキスポーツ／PUMA／公益財団法人JKA／日本たばこ産業株式会社。法人はこの正式商号を使い、自治体名・ブランド名も確定した表記を維持する。SPは1列、640px以上は2列、1024px以上は3列。共通の16px本文・文字色・余白・細罫線を使い、長い名称も欠けずに表示する。ロゴ専用の画像幅Modifierと背景指定は廃止。元支給データは資料フォルダーに保持し、見本は `components.html#sample-clients`。
- 事業内容ページは写真枠とアイコン一覧の反復をページ固有の視覚言語とし、背景の交互切り替えで単調さを抑える。写真が各事業1枚の間は静止表示とする
- 写真が未確定の場合も構造は維持し、クライアント支給後に同じ比率で差し替える
- 数字や実績は確定情報がある場合のみ強調し、ダミー数値をデザイン要素として追加しない

### Works / News / Contact / Privacy

- 実績一覧は `.works-list` / `.work-entry` を使用し、SPでは1列、768px以上では2列、1024px以上では3列とする。詳細ページのない実績にはリンクを付けない。カテゴリは「すべて」とExcelの「大会運営/企画」「大会運営」「パーク運営/監修」「パーク監修」「自治体連携」の5種類をそのまま使い、既存のフィルター・ページ送りで絞り込む。1ページ12件を表示し、カテゴリ変更時は1ページ目に戻す。TOPの `.work-panel` と一覧の `.work-entry` は共通データとカード生成処理を使用し、写真の表示比率は4:3で揃える。Excelにない説明は追加しない
- ニュース一覧は `.news-filter` / `.news-index-list` / `.news-pagination` を使用し、1ページ10件を表示する。SP（767px以下）はネイティブのプルダウン、タブレット・PC（768px以上）は従来のボタンでカテゴリを選択する。両UIの選択肢はJSの同じカテゴリ定義から生成し、表示幅を切り替えても選択状態を共有する。カテゴリ変更時は新しい順に並べ、ページ番号を1へ戻す。ページ送りは第16章のNEWS・WORKS共通仕様を使う。SPでも最初・最後への移動手段を維持する
- ニュース一覧の各行はTOPと同じ `.news__item` / `.news__date` / `.news__category` / `.news__arrow` を使い、`news-index-list` は一覧の容器としてのみ使う。日付フォント、本文サイズ、単体矢印、通常カテゴリのホバー色、重要カテゴリの赤い枠・太字を共通化する。矢印は第2章の通常／hover／focus-visibleの行色を継承する。記事詳細のメタ情報も同じ日付・カテゴリ表現（補足14px、重要カテゴリは状態表示として700）を使い、一覧へ戻る導線には `.text-link` を使う。記事詳細は画像を省略可能な本文構造とし、PCでは左端を揃えたまま記事ヘッダーと写真の幅で右側の余白を整える
- 同じ用途の部品はTOPの既存クラス・状態を再利用し、下層ページだけに通常・ホバー・フォーカス状態を作り直さない。背景や情報量が異なる場合だけModifierとして差分を定義する
- モバイルメニューのMENU／CLOSEは、タップ・マウス操作時だけフォーカス枠を非表示にする。Tab・Enter・Space・Escape・矢印キー操作では共通のfocus-visible表示に戻す。開閉時のフォーカス移動は維持し、画面幅やタッチ対応の有無だけで枠を無効化しない。
- 現在の静的試作ではTOPのお知らせ本文と一覧の仮データは別管理であり、見た目の共通化だけでは記事内容・カテゴリ・リンク先は同期しない。本番CMS化時は同じ記事データから両画面を生成する
- ニュース一覧・詳細とお問い合わせ入力の本文領域は共通の左インデントを維持し、右側にも同じインデントを置いて左右の余白を対称にする。お問い合わせ確認・完了は既存の中央配置と左右対称の余白を維持する。記事本文の段落だけは可読性のため最大行長を維持する
- お問い合わせは `.contact-steps` / `.contact-form` / `.contact-confirm` を共通構造とし、入力・確認・完了を同じ余白と見出しで示す。プライバシーポリシーの個人情報の取り扱いへ新規タブでリンクする
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

### Split Content

- クラス：`.split-content`
- 地図と交通案内など、同じ階層の2要素に使用する
- 現在のアクセスでは地図→交通案内を全画面幅で縦に配置する。交通案内内部の `.access-information__list` は1280px以上で電車・バス・車の3列、それ未満は縦並びにする
- 子要素の幅は必ず `minmax(0, 1fr)` で横溢れを防ぐ

### Map Embed / Access Card

- クラス：`.map-embed`、`.access-card`
- 地図は住所を併記し、外部のGoogleマップを開けるテキストリンクを設ける
- `iframe` には内容を説明する `title` を付け、モバイルで横溢れしない幅にする
- 交通案内は手段ごとにカードへ分け、英字種別、日本語見出し、経路・目安時間の順に記載する
- 時刻表などの配布資料は `assets/documents/` に置き、カード内にダウンロードリンクを設ける
- 案内文はクライアント原稿に従う。経路・運行内容・所要時間の補足を推測して追加しない。電車・バス・車の説明本文は `--color-section-title` を使う
- 現在のボタン文言は「時刻表PDFをダウンロード」、参照は `assets/documents/mokuseigo-timetable-route.pdf`。資料はコミュニティバス「もくせい号」の時刻表であり、原稿のシャトルバスとの対応は未確認。ボタンの維持・注記非表示はユーザー指定であり、資料の対応が確認済みとは扱わない

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
- 飲食出店募集・FAQ：`arkgarden-recruit/index.html`。`arkgarden-recruit/faq/index.html` は `../#faq` への転送として保持
- 共通部品確認：`docs/components.html`

企業概要ページで確定した余白、見出し、情報表、アクセス構成を、今後の下層ページへ展開します。

## 9. 本文幅と共通部品の運用

### 本文幅の使い分け

- 説明主体の短い内容は標準幅で右側の余白を残し、写真・地図・一覧・情報表・工程は `.content-section__body--wide` でページ本文幅を使う。全幅は画面端までの意味ではなく、`.page-shell` と共通余白の内側を指す。
- `--wide` は `--copy-max: 100%`。文章の行長を制限する場合は `--editorial`（42rem）または `--readable-copy`（段落だけ58rem）を併用する。大見出し・写真・情報表まで狭めない。
- リード `.content-section__lead` は第2章のリード仕様を使い、字間0、`text-wrap: pretty`。不要な強制改行をせず、長い日本語は `.content-section__lead-phrase` で意味のまとまりを示す。768px以上ではまとまりが幅に収まる場合だけ保持し、長いまとまりは折り返す。SPも自然に折り返す。
- 会社情報は標準幅、理念は `--balanced`、取引先・アクセスは `--wide`。事業内容は `.business-detail` が本文を広げ、説明文の読み幅を維持する。
- 採用のカード・写真・表・工程は `--wide`。WORK STYLE・JOBSは `--readable-copy` を併用する。飲食出店募集は写真・図面・表を広げ、FAQは標準幅とする。
- ニュース本文は左右のインデントを対称にする。お問い合わせ・求人応募の入力・確認・完了は最大68remを共用する。
- 実物見本：`components.html#sample-copy-width`。

### 小見出し・ボタン

- `.content-groups` は関連項目の容器。間隔はSPが `--space-xl`、768px以上が `--space-2xl`。
- `.content-group` と `.content-group__title` は見出し＋内容の組。通常は第2章の小見出し仕様を維持する。中見出しとして使う場合だけ親へ `.content-group--major` を付ける。Noto Sans JP、PC32px／SP24px・700・1.35、後続24px／16px。赤い斜線や縦線は付けない。
- 共通CSSはローカル変数 `--content-group-title-size / -weight / -line / -after` で役割別トークンを選ぶ。`.content-group` が小見出し値を初期化し、`--major` が中見出し値へ切り替える。入れ子の通常グループは小見出しへ戻り、グループ外の既存タイトルも従来値を維持する。文字指定やページ専用CSSを複製しない。
- 見出し自体のmarginと親gapは0。後続要素のmarginだけで所定の距離を取る。事業のアイコン一覧が単独で持つ上margin56pxは、この既存の隣接要素ルールで24px／16pxへ置き換わる。写真からグループまでの距離は外側の `.content-groups` のgapが所有し、見出し後の余白と区別する。
- 実使用先は事業内容4事業とアイコン一覧の見本3点。採用情報・飲食出店募集の既存 `.content-group` は小見出しのまま維持する。募集要項の注記と個別職種も別グループで関係を示す。
- PDFは `.action-button.action-button--outline` と `.ui-download-icon` を共用する。実URL、`download` 属性、資料を区別できる読み上げ名を付ける。
- TOPの20ft・40ftの `.garden-container__actions` は共通 `.action-button` の文字・高さ・padding・丸矢印を維持し、利用可能幅で自然に折り返す。2個が収まれば横並び、収まらなければ同じ全幅で縦並び。文字は1行を保ち、丸矢印は右端に揃える。共通gapは最小間隔として維持する。見本の暗色ボタンもこの実部品の組み合わせを使う。
- フォーム等の `.contact-actions` は中央配置。既存の `--pair`（主要ボタン2個）と `--mixed`（主要ボタン＋補助リンク）のSP用2列・縮小指定は今回変更しない。TOP専用の縮小はこのルールから切り離した。単独ボタンに新たな2列指定を付けない。
- アンカー先は `.content-anchor` を使い、固定ヘッダーを避ける。確認画面からの戻るボタンは「修正する」に統一する。

### 工程・添付・開閉

- `.detail-feature` は本文と写真の2要素。768px未満は縦、以上は等幅2列。通常写真は4:3、図面は `--contain` で切り抜かない。完成イメージは `.garden-entry-cta__media` と `.media-caption` を再利用し、キャプションを右下へ置く。
- `.process-list` は意味のある順序を持つ工程の `ol/li`。768px未満は工程を縦に並べ、768px以上は工程全体の3列配置を維持する。各liはPC/SPとも番号の左列と見出し・本文の右列に分ける。番号列は工程番号トークンの幅、列間は `--space-md`。番号は上揃えで2行分の領域に置き、見出しが複数行でも本文は右列の次行へ続ける。見出しから本文までは共通の `--type-heading-sm-after` のみを使い、row-gapを加算しない。番号下のmarginは0。番号の文字仕様は第2章、小見出し・本文の文字値も維持する。
- 各liのalign-contentはstartにし、隣の工程が長文でも見出しと本文の間隔を広げない。上罫線とその内側padding、工程間の `--space-xl` は維持する。DOMの順序とol/liは変更しない。見本・採用ページとも `subpage.css` の同じ指定を使う。
- `.attachment-control` はファイル入力・選択名・取り消しをまとめる。未選択をエラー色にせず、長いファイル名を折り返す。
- 添付UIは `subpage-components.js` が管理する。フォーム側は `attachment:restore` の `detail.name` で保存名を復元し、`data-attachment-name` で確認用の名前を取得する。共通JSをフォームJSより先にdeferで読む。ファイル本体は保存・送信しない。
- FAQは `.faq-list / .faq-item`、詳細は `.disclosure-list / .disclosure[data-disclosure]`。ネイティブの `details/summary` とキーボード操作を保ち、複数を同時に開ける。summary内に別ボタンを置かない。
- 開閉は共通JSで高さを400msで伸縮し、連続操作時は現在の高さから反転する。閉じる途中の回答は操作対象外、動きを減らす設定では即時切り替えとする。詳細モーダルは使用しない。
- 実物見本：`components.html#sample-groups`、`#sample-form`、`#sample-process`、`#sample-faq`、`#sample-disclosure`。

## 10. 採用情報・求人応募

### 構成・素材

- 正式な施設表記は「寒川町相模川一之宮公園」「寒川町ストリートスポーツパーク」。旧施設名は新規の表示文言に使わない。ただしExcel正本の歴史的な実績名・既存URL・識別子・素材ファイル名は機械的に置換しない。
- 募集区分は公園の社員・アルバイトと、スポーツパークの受付社員・運営管理社員／BMX FLATLAND・SKATEBOARD STREET講師／アルバイト・清掃スタッフの3件。
- 本サイトで詳細と応募を管理するのは公園。スポーツパークは正式な外部URL受領まで「採用サイト準備中」とし、公園のフォームや架空URLへ接続しない。
- TOP・採用ページ・見本は `.recruit-facilities` 内に2つの `.recruit-facility` を置く。各施設の直下に `.page-shell.recruit-facility__inner` を置き、施設名 `.recruit-facility__name` →施設写真 `.recruit-facility__perspective` →募集案内 `.recruit-facility__layout` の同じ構造を使う。両ページの大見出しと既存アンカーは保持する。
- 公園は通常背景 `.section-surface--base`、スポーツパークは既存の薄い補助背景 `.section-surface--tinted`。施設ブロックはpage-shellの外へ出し、背景を画面幅いっぱいに広げる。内容は内側のpage-shellで揃え、別背景の本文プレート・黒い横線・新色は追加しない。
- 施設名は中見出し、募集見出しは小見出し、説明は本文の既存トークンを使う。施設名と募集見出しは共通CSSのtext-wrap: balanceで自然改行を均し、強制改行や文字縮小は加えない。施設名の後は隣接する写真のmarginでPC24px／SP16px、写真の後は募集案内のmarginで40pxを一度だけ確保する。施設内の親gapと見出しmarginは0。募集見出し→説明はcopyのgapでPC16px／SP12px、バナー→copyとcopy→ボタンは24px。施設全体の上下paddingはSP40px／768px以上64px。
- 全施設写真は `assets/images/placeholder/sample-1.webp` を共用し、最大 `--content-narrow`（68rem）・16:9・中央配置とする。SPは内側の利用可能幅に収める。altは空とし、施設の記録写真と説明しない。支給後は同じimgのsrcとaltを差し替える。写真上の文字・キャプションは置かない。
- 各募集カードは `.recruit-opening` 内の募集バナー→`.recruit-opening__copy`（見出し・既存説明）→既存のボタン／準備中spanの順。公園の1件だけ `.recruit-opening--featured` を使い、768px以上は左バナー・右copy＋ボタン、未満は縦積みとする。社員・アルバイトを別カードへ分割しない。
- スポーツパークは `.recruit-facility__layout--park`。768px未満は1列、768〜1279pxは2列、1280px以上は3列。複数列では各カードを3行のsubgridにし、バナーの上下端・見出し開始・ボタン位置を同じ行で揃える。copy内部は小見出し後の共通gapを維持し、文章量の差はcopyの共有行の余白で吸収する。固定高・行数制限・省略・個別縮小は使わない。
- 募集バナーの表示枠は16:10、背景透明。`.recruit-opening__media img` は幅・高さ100％、`object-fit: cover`・中央配置とし、通常時は縮小せず枠いっぱいに表示する。画像のズームは募集カード `.recruit-opening` のhover判定を使い、hover可能・fine pointer・`prefers-reduced-motion: no-preference` の場合だけscale(1.035)へ拡大する。画像だけを `--dur-nav`・`--ease-out` で滑らかに往復させ、枠はoverflow: hiddenで固定する。WORKSと同じ既存のアニメーション定義へセレクターを追加し、既存用途の挙動は変えない。動きを減らす設定とタッチ端末ではズームを適用せず、旧縮小値は復元しない。通常時は16:10の文字入り素材3点を全体表示し、3:2の講師写真だけ上下を中央トリミングする。人物の顔・頭・足元・スケートボードを保持し、左右の空きは作らない。元画像の加工・生成・複製はせず、採用ページのKV等へは適用しない。
- 募集バナーhover拡大の確認（2026-11-08）：TOP・採用・見本を320／375／767／768／1279／1280／1440pxで確認し、21画面条件とタッチ端末の778項目を通過。カードhoverで画像のみ1.035倍へ拡大し、520msの共通トークンで往復する。枠・カード・隣接内容の位置と寸法は不変。通常時の全面表示・透明背景・中央トリミングを維持し、reduced-motion／タッチ端末では拡大も縮小もない。採用KV等の他画像・元素材は変更していない。
- 募集バナー全面表示の確認記録（2026-11-08、hover拡大復元前）：320／375／414／767／768／1024／1279／1280／1440px、TOP・採用・見本の27画面条件で通常・hover・reduced-motionの2,268項目を通過。全バナーが透明背景の16:10枠を埋め、縮小・拡大・文字入り素材の切り取りがない。講師写真の中央トリミングは人物の頭・足元・スケートボードを保持でき、Modifierは不要だった。施設写真・カード・見出し・ボタンの寸法と配置、採用KVを含む他画像の指定は作業前と一致。元画像は変更していない。
- TOPの公園リンクは `recruit/#garden-careers`、採用ページ内は `#garden-careers`、見本は `../recruit/#garden-careers` を維持する。スポーツパーク3件は操作できない準備中spanとし、外部URL等を新設しない。
- 旧 `.recruitment-*`、旧公園専用layout・番号・写真キャプションの指定は、HTML・JSの参照がないことを確認して整理した。施設名と職種の文字指定、カード配置を共通部品へ集約する。募集バナーのhover拡大は上記の共通アニメーション条件で管理し、通常表示を縮小しない。
- 本文の順序は募集区分→WORK STYLE→JOBS→FLOW。WORK STYLEは会社紹介と働く環境、JOBSは仕事内容・人物像・募集要項、FLOWは応募→面接→採用発表。
- WORK STYLE・JOBSの内容は支給「採用情報_公園.pdf」に基づく。根拠のない働きやすさや条件を創作せず、給与・人数等の「（仮）」を保持する。
- WORK STYLEのリードは「公園の日常と、<br />地域のにぎわいを支える。」。右の画像は `assets/images/media/ark-garden-night-perspective.webp` を共用し、「完成イメージ」を右下に表示する。
- 公園の求人バナーは `recruit/ichinomiya-park-staff.webp`。スポーツパークの受付・運営は `recruit/samukawa-street-sports-park-operations.webp`、講師は `recruit/staff-instructor-cleaning.webp`、アルバイト・清掃は `recruit/samukawa-street-sports-park-cleaning.webp`。
- 採用メイン・求人応募3画面のKVは `recruit/staff-instructor-cleaning.webp` を共用。`.page-hero--image-top` の現行位置は `36% 34%`。
- WORK STYLE末尾・JOBS末尾は求人応募ボタンだけを表示し、「選考の流れを見る」のページ内リンクは置かない。FLOWセクション自体は残す。
- 実物見本：`components.html#sample-recruit`、`#sample-feature`。
- 確認記録（2026-11-08）：対象3ページを320／375／414／767／768／960／1024／1280／1440pxで確認し、共通の文字・画像寸法・背景・余白・カード整列が一致。他13ページを375／768／1440pxで作業前と比較し、背景・本文プレート・文字・余白を維持した。長文差し替え、既存リンク遷移、準備中の非操作状態、フォーカス、通常hoverと動きを減らす設定を確認。横溢れ・JS例外なし。採用詳細のDOM、全JS、トークン、画像ファイル、資料用CSSは変更していない。

### 求人応募の静的試作

- 必須は氏名・メール・希望職種・志望動機・履歴書添付・個人情報同意。電話番号と職務経歴は任意。現行フォームの希望職種は試作用で、JOBSの最新職種との同期が残っている。本番では条件と照合して確定する。
- `recruit-application.js` の保存先は `ark-garden-recruitment-preview`。お問い合わせは `ark-contact-preview` を使い、互いの保存内容を変更しない。
- 入力・確認・完了は現在それぞれ専用HTML。各本文アンカーへ遷移し、確認から修正に戻れる。実送信は行わない。
- 履歴書は名前だけを保持する。確認から戻る場合の仮必須判定を本番のファイル検証として流用しない。
- 確認画面へ直接アクセスし有効な入力がない場合は入力へ案内し、完了時は求人応募データだけを削除する。

## 11. 飲食出店募集

### TOPと内部導線

- ヘッダー・メニュー・フッターの「飲食出店募集」と、NEWS先頭の固定告知「募集概要を見る」はTOPの `#ark-garden` へ接続する。見本は相対パスでTOPへ接続する。
- 募集告知はNEWS見出し→写真・日付のない固定告知→通常記事→一覧リンクの順に置く。ヒーロー直下の写真付き告知と、記事一覧内の募集行は削除し、重複を解消する。TOP下部の募集セクションと画像は維持する。固定告知の表示・CMS管理・募集終了時の手順は第18章を参照する。
- TOPの紹介写真には説明文を重ねず、SPでも写真下の説明文を置かない。上部のセクション見出しと画像のalt、右下の「完成イメージ」は維持する。文章用ラッパー・余白と、可読性用の暗いグラデーションは削除した。写真枠の寸法・トリミングは維持する。
- 20ft・40ft枠は768px以上で2列、未満は縦並び。画像は3:2の枠に `object-fit: contain` で全体を表示する。
- TOPの枠は `arkgarden/container-20ft.webp`（支給container_9）と `container-40ft.webp`（container_3）。AREAの図面とは別素材のため混同しない。
- 詳細は `arkgarden-recruit/#container-20ft` / `#container-40ft` へ接続。枠下のFAQ導線は日本語ラベル「飲食出店に関するよくある質問」→英字「FAQ」→矢印で構成し、行全体を `arkgarden-recruit/#faq` へ接続する。書体・文字値と配置は第19章を参照する。
- Googleフォームはクライアント管理。正式URL未受領の応募ボタンは `href="#"`・`data-pending-link`・`aria-disabled="true"` と準備中の読み上げ名を持つ。確定時はTOP・各AREA・スケジュール下をコンテナ別に一括更新する。
- 旧サイト内の飲食出店応募3画面と `application.js` は削除済み。採用応募・お問い合わせは別用途として保持する。

### 詳細ページ

- `arkgarden-recruit/index.html` の順序はCONCEPT→STRENGTHS→AREA→SCHEDULE→FAQ。KV下の `.inpage-nav` は20ft・40ft・スケジュール・FAQへ接続する。
- 内部ナビは `.text-link` の丸囲み下矢印。帯背景や上下罫線を付けず、SPは2列、768px以上は4項目を中央に並べる。
- CONCEPTの写真2枚は `placeholder/sample-1.webp`。STRENGTHSは支給文5段落を省略せず常時表示し、`arkgarden/park-masterplan.webp` を添える。「遊具（未定）」なども支給表記を維持する。
- AREAは20ft→40ftを縦配置。20ftは `arkgarden/container-20ft-plan.webp`（支給container_11）、40ftは `arkgarden/container-40ft-ground-plan.webp`（container_5）。図面を本文幅いっぱいに表示し、その下に概要を置く。図面の縦横比・情報を保持し、切り抜かない。
- `.summary-facts` で主要条件を常時表示。「区画・客席」「費用・支払い条件」「営業・契約条件」だけを各コンテナ3個、計6個のアコーディオンにする。全文・費用は支給PDFに基づき、古い `000000円` の仮表へ戻さない。
- 共通の応募資格・出店条件は `#conditions` に集約して常時表示する。STRENGTHSと共通条件は折り畳まない。
- 各AREA末尾は `.rental-area__navigation` の中で応募・PDFを横並びにし、その下中央の「スケジュールを見る」を `#schedule` へ接続する。
- SCHEDULEは「スケジュール」／「応募から開業までの流れ」。`.schedule-timeline` の3段階・13工程で、PCは日付・節点・工程の3列、768px未満は日付を工程上へ移す。結果通知は2027年9月下旬に統一し、全日程は予定として扱う。
- スケジュール末尾も20ft・40ft別に応募・PDFボタンを置く。募集PDFは `assets/documents/arkgarden/20ft-recruitment.pdf` と `40ft-recruitment.pdf`。支給PDF自体は変更しない。
- FAQは原稿待ちの10項目とダミー回答。PDFから独自の回答を創作しない。旧 `arkgarden-recruit/faq/index.html` は `../#faq` への転送のみを保持する。
- 実物見本：`components.html#sample-inpage-nav`、`#sample-schedule`、`#sample-disclosure`。見本の日付・費用は構造確認用で、募集条件の正本にはしない。

## 12. 更新時の確認

1. 既存HTML・CSS・JS、クライアント原稿、最新のユーザー指定を確認し、再利用を優先する。新しいCSS・JS等が必要な場合は内容・理由・対象ファイルを編集前に伝える。
2. 変更範囲外と未コミットの作業を保持する。`docs` の更新だけならサイト本体を変更しない。
3. 共通部品を変えたときは `components.html` と使用ページを320 / 375 / 767 / 768 / 1024 / 1440pxで確認する。
4. リンク先・画像・DOM内IDと読み上げ名、通常・hover・focus-visible・disabled、動きを減らす設定を確認する。
5. WORKSは正本Excel・共通データ・素材対応表を照合し、31件・5カテゴリ・12/12/7件・TOP最新6件の順序・クレジットを確認する。
6. フォーム変更時は必須検証・添付・確認・修正・完了・直接アクセスと、別フォームの保存データへの影響を確認する。
7. 日付の古さや参照の有無だけで資料を削除しない。役割と内容の重複を確認し、過去案が現行ルールと競合する記述だけを整理する。


## 13. 文字の分類と既存クラスの対応

2026-11-07調査。HTMLと `works.js`／`subpage-content.js` が生成するDOMを確認しました。「例外なし」は今回の共通ルールを適用済み、「個別判定待ち」は共通部品を用意し、各ページへの役割付けを次工程に残すものです。

| 掲載箇所 | 文言例 | 既存クラス・生成元 | 分類 | 適用する共通ルール | 例外の有無 |
| --- | --- | --- | --- | --- | --- |
| TOP・全下層のセクション開始 | BUSINESS／事業内容 | `.section-title__en`、直後のh2 | 大見出し | 英80/48、日本語32/24、後続64/40 | なし。長文は自動縦積み |
| TOP採用・採用ページ | 寒川町相模川一之宮公園 | `.recruit-facility__name` | 中見出し | 32/24・700・1.35、後続24/16 | なし。長い名称は折り返す |
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
| TOPの企業説明 | 現場で培った知見を生かし… | `.company__content > p` | 本文 | 16・400・1.8 | 画像上の構成・色は維持 |
| TOPのコンテナ名 | 20ftコンテナ | `.garden-container h3` | 小見出し | 24/20、後続16/12 | なし |
| TOPのFAQ導線の説明 | 飲食出店に関するよくある質問 | `.route-item__label` | 項目ラベル | 16・700・1.5、Noto Sans JP | 暗色面の補助文字色を維持 |
| 交通案内の経路 | 寒川駅より徒歩約30分 | `.access-card h4 + p` | 本文 | 16・400・1.8 | なし。14pxから変更 |
| 地図の所在地 | 神奈川県高座郡寒川町… | `.map-embed__meta p` | 本文 | 16・400・1.8 | 外部地図リンクのUI文字は対象外 |
| 取引先名の一覧 | 株式会社ディー・エヌ・エー | `.clients-grid li` | 本文 | 16・400・1.8 | リンク・ロゴ化はしない |
| 通常情報表 | 仕事内容／勤務地 | `.definition-list dt` | 項目ラベル | 16・700・1.5 | なし |
| 通常情報表の説明する値 | 園内の巡回、安全確認… | `.definition-list dd` | 本文 | 16・400・1.8 | 旧一律500・最大18pxを撤去 |
| コンテナ主要条件 | 月額家賃／営業時間 | `.summary-facts dt` | 項目ラベル | 16・700・1.5 | なし |
| コンテナ主要条件の値 | 110,000円／5区画・約14.5㎡ | `.summary-facts dd` | 強調する本文 | 18・500・1.8 | 主要条件の要約に限定 |
| 表の値に付く補足 | 税込・予定／※現住所 | `.definition-list dd span`、`.summary-facts dd > span` | 補足・注記 | 14・400・1.6 | span全体が値の場合は個別マークアップを再検討 |
| 出店条件の注意 | BAR、スイーツをメイン… | `.rental-area__note` | 補足・注記 | 14・400・1.6 | なし |
| 募集要項の未確定条件 | 給与・募集人数…は仮条件 | 現行 `.content-section__copy` | 意味上は補足・注記 | 補足として分離する場合は14・400・1.6 | 個別判定待ち。本文クラスのまま16px |
| フォーム入力・確認 | 氏名／メールアドレス | `.contact-form__row > label:first-child`、同span、`.contact-confirm dt` | 項目ラベル | 16・700・1.5 | 必須・任意バッジは状態UIを維持 |
| フォーム確認の値・同意文 | 入力した氏名／同意します | `.contact-confirm dd`、`.contact-form__check` | 本文 | 16・400・1.8 | 入力・送信の試作動作は変更しない |
| 完了画面 | ご応募ありがとうございます | `.contact-complete h3`／p | 中見出し／本文 | 32/24と16、後続24/16 | なし |
| TOPの固定募集告知 | 寒川町相模川一之宮公園にて、飲食出店者を募集しています | `.news-announcement__title` | 小見出し | 24/20・700・1.5 | 写真・日付なし、CMS対象外。第18章参照 |
| NEWS一覧・TOP | ARK LEAGUEの事業内容を… | `.news__item p`（HTML・JS生成） | 本文 | 16・400・1.8 | 既存の1行省略は用途別に維持 |
| NEWS重要項目 | パーク運営・イベント企画に関するご相談… | `.news__item--important p` | 強調する本文 | 18・500・1.8 | カテゴリの赤い枠を維持。矢印は通常黒、hover／focus-visibleで赤 |
| NEWS記事タイトル | 記事のタイトル | `.news-article__header h3` | 中見出し | 32/24・700・1.35 | PCのメタ情報併置は既存レイアウト |
| NEWS本文・プライバシー本文 | 個人情報の利用目的… | `.news-article__body`、`.privacy-copy` | 本文 | 16・400・1.8 | なし |
| 記事・ポリシーの小区分 | 第三者提供 | `.news-article__body h4`、`.privacy-copy h3` | 小見出し | 24/20、後続16/12 | 左線・専用左余白を撤去。段落との二重余白なし |
| NEWS日付・カテゴリ | 2026.09.23／イベント | `.news__date`、`.news__category`、`.news-article__meta` | 補足・注記 | 14・400・1.6 | 重要カテゴリの700だけ状態UIの例外 |
| WORKS案件名 | YOKOHAMA URBAN SPORTS FESTIVAL… | `.work-panel__meta h3`、`.work-entry h3`、`works.js` | 小見出し | 24/20・700・1.5、後続16/12 | Excelの改行とカード伸縮領域を維持 |
| WORKS年・カテゴリ | 2026年／大会運営/企画 | `.work-panel__category`、`.work-entry__category`、`.work-entry__description` | 補足・注記 | 14・400・1.6 | カテゴリ名を項目ラベルと混同しない |
| 画像キャプション・クレジット | 完成イメージ／©Jason Halayko / YUSF | `.media-caption`、既存caption別名、`.news-article__media figcaption` | 補足・注記 | 14・400・1.6 | 位置・写真は維持 |
| 添付ファイル・状態通知 | 選択されていません | `.attachment-control__filename`、`.contact-form__status` | 補足・注記 | 14・400・1.6 | 選択・取消ボタンは操作UI仕様 |
| 事業の対応範囲の見出し | 事業内容 | `.content-group--major > .content-group__title`（実ページh3／見本h4） | 中見出し | 32/24・700・1.35、後続24/16 | 共通グループの中見出し版 |
| 事業の対応範囲アイコン | 運営／コミュニティ形成 | `.business-capability-grid__label`（実ページh4／見本h5） | 項目ラベル | 16・700・1.5 | タグに依存せず見た目を維持 |
| FAQ・詳細の開閉名 | 出店条件について | `.faq-item summary`、`.disclosure summary` | 項目ラベル | 16・700・1.5 | Q/Aと＋/−は用途別記号を維持 |
| FAQの回答 | テキスト… | `.faq-item__answer` | 本文 | 16・400・1.8 | 仮原稿は変更しない |
| 工程の見出し・説明 | 応募／内装・厨房計画 | `.process-list h3`、`.schedule-phase__title`、`.schedule-step__body h4` | 小見出し／本文 | 24/20と16、説明前16/12 | 工程番号・日付・段階内配置は用途別 |

### 今回標準化しない用途別コンポーネント

| 掲載箇所・文言例 | 既存クラス | 今回の扱い | 次工程 |
| --- | --- | --- | --- |
| TOPメインコピー／Living Culture. | `.hero__title`、`.hero__tagline` | 現行の流動サイズ・行間を維持 | 必要時にKVとして別途調整 |
| 下層ページ名／COMPANY | `.page-hero__title-en`、`.page-hero h1` | 現行の用途別仕様。80/48へ機械的に変えない | KV単位で検討 |
| グローバルナビ・メニュー・フッター | `.global-nav`、`.mobile-menu__nav`、`.site-footer__*` | 操作・サイト案内・ブランド文の現行仕様を維持 | 個別依頼時に検討 |
| 主要ボタン・補助リンク・フィルター | `.action-button`、`.text-link`、`.news-filter`、`.news-pagination` | 操作UIの文字サイズを維持 | 必要時にUI全体で検討 |
| 事業パネル | `.business-panel__*` | PC縦書き等の用途別仕様を維持 | ページ別工程で検討 |
| 工程番号・日付・進行表示 | `.process-list__number`、`.schedule-step__year/date`、`.contact-steps` | 工程番号は第2章の専用32px。日付・進行表示は既存仕様を維持 | 標準本文と別管理 |
| ACCESS GUIDE／TRAIN、FAQのQ/A | `.access-information__label`、`.access-card__type`、`.faq-item__symbol` | 構造ラベル・記号の現行仕様を維持 | 新規標準ラベルと区別 |
| 必須・任意・重要カテゴリ | `.contact-form__required/optional`、`.news__category--important` | 小型バッジ・重要状態として現行差分を維持 | 状態UIとして評価 |
| TOPのFAQ導線 | `.route-item__title` | 現行TOPで使用中。Noto Sans JP・32/20px・600・1.05を使用 | 第19章を参照 |
| 未使用の旧構成 | `.split-feature__content` | 今回の現行部品への適用対象外 | 再利用時は役割を再分類 |

### 残るページ別の確認事項

1. 実際のページでタイトルとリードの主従に問題がある場合は、役割の再分類としてページごとに確認する。見本の説明見出しに合わせてリードを小さくしない。現在の `.content-group__title` とリードの組み合わせ（採用情報の「会社紹介」等）は、主見出しか説明ラベルかを判断する対象になる。
2. 採用カードの長い施設名は共通サイズの自然改行を維持した。375px付近では「寒川町ストリートスポーツパーク」の末尾1文字が次行に回るため、ページ別工程で文章のまとまりと配置を検討する。専用の縮小・強制改行バリエーションは追加しない。
3. 採用要項の仮条件・長い注記の文章構成は、原稿確定時にページ別に整理する。情報表はdt/dd各16pxを維持する。

背景色・フッター・写真・バナー・募集情報の位置・書体比較は今回の整理対象に含めません。

## 14. 実部品と見本専用表示の使用先

| 実部品 | 使用ページ・生成元 | 部品見本 |
| --- | --- | --- |
| 英字＋日本語のh2大見出し・自動縦積み | TOP、全下層、`script.js` | 各セクションの見出し |
| 施設名・職種・長い名称の採用カード | TOP、採用情報 | `#sample-recruit` |
| 本文幅・リード・本文 | 事業内容、採用情報、飲食出店募集 | `#sample-copy-width` |
| 本文＋写真、完成イメージ注記 | 採用情報 | `#sample-feature` |
| 取引先名 | 企業概要 | `#sample-clients` |
| WORKSカード | TOP、WORKS、`works.js` | `#sample-works`（同じデータ・描画処理） |
| 対応範囲アイコン | 事業内容 | `#sample-icons-four / five / six` |
| 通常情報表・費用詳細 | 企業概要、採用情報、飲食出店募集 | `#sample-groups`、情報表 |
| 18px主要条件・詳細アコーディオン | 飲食出店募集 | `#sample-disclosure` |
| 固定募集告知 | TOPのNEWS先頭、記事一覧の外側 | `#sample-news-announcement` |
| NEWSのカテゴリ・18px重要項目・長いタイトルの省略 | TOP、NEWS一覧・記事、`subpage-content.js` | `#sample-news`（重要／通常×短文／長文） |
| 共通のページ送り | NEWS一覧、WORKS一覧、`pagination.js` | `#sample-pagination-2-1` ほか、2・3・12ページの先頭／中間／末尾 |
| 応募・PDFボタン | TOP、採用情報、飲食出店募集、フォーム | 共通ボタン・暗色面のボタン |
| 入力・添付・進行表示 | お問い合わせ、求人応募 | `#sample-form` |
| TOPのFAQ導線 | TOP飲食出店募集 | `#sample-garden-faq-route` |
| FAQ・ページ内リンク・日付付き工程 | 飲食出店募集 | `#sample-faq / sample-inpage-nav / sample-schedule` |
| 番号付き選考工程 | 採用情報 | `#sample-process` |
| 標準小見出し | お知らせ詳細、プライバシーポリシー | 記事本文・ポリシーの小見出し |

HTMLだけでなく、JSのクラス生成と状態付与を使用判定に含めます。見本専用の説明・比較・枠・配置の全指定は `docs/components.css` に置き、サイトCSSから切り離します。部品の仕様値は第2章を参照し、他のガイドラインでは同じ数値表を複製しません。

## 15. 2026-11-07 部品整理の確認記録

この節は前回の部品整理時点の記録です。デザイン見本の現在の掲載方針は第2章、ページ送りの最新仕様は第16章を参照してください。

### 整理した範囲

- サイトのHTML・JSで使われていない、日本語だけの大見出し・h3による大見出し・強制縦積み・情報表の強調値・特別な長名称の改行・募集資料の配置見本を削除した。見本にしかなかった汎用文字ヘルパーも削除し、各役割を実部品で確認する構成にした。
- 説明、見本同士の配置、枠、説明用の背景、ボタン見本の配置を `components.css` へ分離した。説明内の見本間リンクを削除し、機能としてのページ内リンクとスキップリンクは保持した。
- 小見出しと上罫線、工程番号、記事・ポリシーの小見出し、NEWSカテゴリの共通指定を整理した。数値の正本は第2章。本文のリード、18pxの強調本文、自然な大見出しの自動縦積み、応募・PDFボタンは維持した。
- 概要とアコーディオンの組は実際の `.rental-area` の配置を再利用した。フォーム進行表示の下余白は実部品に任せ、見本容器のgapで重ねない。

### 変更ファイル

実装・見本・仕様の8ファイル：

- `assets/css/tokens.css`
- `assets/css/style.css`
- `assets/css/subpage.css`
- `docs/components.html`
- `docs/components.css`（新規）
- `docs/DESIGN_SYSTEM.md`
- `docs/DESIGN_GUIDELINES.md`
- `docs/CODING_GUIDELINES.md`

次の15ファイルは、今回の作業開始時点からの差分がCSS参照URLのキャッシュ値だけであることを照合した。更新値は `20261107-components-2`。既存のHTML本文と見出し階層は保持している。

- `index.html`
- `business/index.html`
- `company/index.html`
- `recruit/index.html`
- `arkgarden-recruit/index.html`
- `works/index.html`
- `news/index.html`
- `news/sample-news/index.html`
- `contact/index.html`
- `contact/confirm/index.html`
- `contact/complete/index.html`
- `recruit/apply/index.html`
- `recruit/apply/confirm/index.html`
- `recruit/apply/complete/index.html`
- `privacy-policy/index.html`

作業開始時に未コミット状態のテキストファイルを退避し、その状態からの差分を照合した。既存の文字トークンと汎用トークンは維持し、工程番号・NEWSカテゴリ列の専用トークンだけを追加した。JS・画像・PDFは変更していない。

### 確認結果

Chromiumで320／375／767／768／1024／1440pxを確認した。

- TOP、事業内容、企業概要、採用情報、飲食出店募集、WORKS、NEWS一覧・詳細、お問い合わせ・求人応募の入力／確認／完了、プライバシーポリシー、部品見本の16ページ×6幅で、横溢れとJavaScript例外を検出しなかった。確認ページへの直接アクセス時は既存の入力画面への誘導も含む。
- 部品見本と実ページの計9種×6幅で、文字値・上罫線までの距離・通常情報表・18pxの強調・リード・カテゴリの1行表示・PCタイトル列揃え等、1,809項目を測定し、実部品と見本の計算済みスタイルも一致した。
- 最終的な見本の配置で追加594項目を確認し、フォームと概要・詳細の余白の重複、空の見本、横溢れ、ID重複、無効なページ内アンカーがないことを確認した。FAQはEnterで開き、Spaceで閉じる操作も全6幅で確認した。
- 見本専用CSSの読込先は `docs/components.html` だけ。資料3冊の見本アンカー29件は有効で、削除したバリエーションの参照も残っていない。
- スクリーンショットで長い採用名称、大見出しの自動配置、本文とリードの区切り、工程、FAQ、情報表、NEWS、記事・ポリシーの小見出しを確認した。既存の一覧タイトルの意図した省略を除き、文字の欠けを認めなかった。
- `git diff --check` は問題なし。残るページ別の判断事項は第13章の優先順を参照する。

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
- `.news-pagination button` の数字はNoto Sans JPを使う。NEWS・WORKS・見本で同じ共通指定を参照する。番号14px、移動ボタン12pxと既存の太さ・行間・余白を維持する。移動ボタンは従来からNoto Sans JPであり、その指定は変更しない。フォームのステップ番号は今回の変更対象外とし、Antonioを維持する。
- ページ変更後は共通処理の `scrollTarget` に指定した一覧へスクロールする。NEWS・WORKSは同じ固定ヘッダー用のスクロール余白を使う。通常はsmooth、動きを減らす設定ではinstantで移動する。NEWS・WORKSは件数と現在ページを安定した `role="status"` 要素で通知する。NEWSは一覧全体のlive領域をこの短い通知へ置き換えた。ボタンを作り直した後も、操作中のボタンまたは現在ページへフォーカスを戻し、画面幅変更でも現在ページを維持する。

### デザイン見本と記事タイトル

- ページ送りの見本は2ページの1／2、3ページの1／2／3、12ページの1／6／12を表示する。1ページの場合も「ページ送りなし」と示す。実際のNEWS・WORKSへ架空の掲載データは追加しない。
- NEWSは重要／通常のお知らせそれぞれに短いタイトルと長いタイトルを置く。カテゴリは14px・1行全文、記事タイトルだけを既存のCSS `text-overflow: ellipsis` で1行省略する。重要項目の18px・500、通常の16px・400を維持する。
- JSでタイトルを切り取らず、DOMには全文を残す。記事詳細の `.news-article__header h3` は折り返して全文を表示し、一覧の省略指定を適用しない。見本用の記事文章は実際の掲載原稿ではない。
- 技術説明、部品の使用先、ファイル対応は本書に残す。クライアント向けの見本へ再掲載しない。説明領域を削除した跡には空の枠を残さない。

### 今回の変更ファイル・確認結果

本節の追加と同時に変更した実装・資料は次の11ファイル。作業開始時の未コミット変更を退避し、その状態からの差分を照合した。

| ファイル | 今回の変更 |
| --- | --- |
| `assets/js/pagination.js`（新規） | 番号生成、移動、無効・現在状態、画面幅変更、フォーカス、スクロール、見本状態の生成を共通化 |
| `assets/js/subpage-content.js` | NEWSの重複処理を共通部品へ置換、件数・現在位置の通知 |
| `assets/js/works.js` | WORKSの重複処理を共通部品へ置換 |
| `assets/css/subpage.css` | 四角いページ送りの共通配置、SPの段分け、一覧のスクロール余白 |
| `news/index.html` | 共通JSの読み込みと状態通知の要素 |
| `works/index.html` | 共通JSの読み込み |
| `docs/components.html` | クライアント向けの表示文章、4通りのNEWSタイトル、ページ送りの状態見本 |
| `docs/components.css` | 削除した技術説明領域のスタイルを除去。見本名・サンプル枠・配置は維持 |
| `docs/DESIGN_SYSTEM.md` | 表示方針、共通API・表示ルール・読み込み先・確認結果の正本 |
| `docs/CODING_GUIDELINES.md` | 共通JSの構成と仕様の参照先 |
| `docs/DESIGN_GUIDELINES.md` | クライアント向け見本と開発者資料の役割 |

次の13HTMLはCSS／既存JSの参照URLのキャッシュ値だけを更新した。本文・見出し階層・機能属性は変更していない。更新値は `20261107-pagination-1`。

- `index.html`
- `business/index.html`
- `company/index.html`
- `recruit/index.html`
- `arkgarden-recruit/index.html`
- `contact/index.html`
- `contact/confirm/index.html`
- `contact/complete/index.html`
- `news/sample-news/index.html`
- `recruit/apply/index.html`
- `recruit/apply/confirm/index.html`
- `recruit/apply/complete/index.html`
- `privacy-policy/index.html`

確認結果：

- Chromiumで320／375／767／768／1024／1440pxを確認。NEWS・WORKS・見本の表示と操作を確認し、ほかの共通CSS使用ページを含む16ページ×6幅も巡回した。フォント・配置が確定した状態で横溢れ・意図しない文字欠け・JS例外を認めなかった。
- NEWSの10＋2件、WORKSの12＋12＋7件、前後・番号移動、カテゴリごとの再計算と1ページへのリセットを確認した。1ページになった場合はページ送りとその外側の余白が消える。
- 1〜30ページの全現在ページ、計465状態をSP／PCそれぞれで検証。2・3・12ページの見本、最初・最後への移動、無効状態、番号の範囲・重複・省略、全6幅の44px操作領域と収まりを確認した。
- 全6幅で重要／通常×短文／長文の4例を測定し、タイトルだけがCSSで省略され、カテゴリは全文1行、DOMにはタイトル全文が残ることを確認。記事詳細も長文へ差し替えたブラウザ内の検証で全文折り返しと非クリップを確認した。検証用の長文を実記事データへ追加していない。
- 全6幅でEnterによる移動後のfocus-visibleと現在位置通知、一覧への移動を確認。通常の滑らかなスクロールも375／1440pxのNEWS・WORKSで完了位置を測定した。
- 見本と実ページは同じJS・CSSを使う。資料用CSSは見本だけ、共通ページ送りJSはNEWS一覧・WORKS一覧・見本だけが読む。技術説明・使用先の表示、説明用の空枠、無効な見本アンカー、ID重複は残っていない。
- NEWSの掲載配列、`works-data.js`、`script.js`、`style.css`、`tokens.css` は作業開始時と一致。実績・ニュースの追加や並び替え、文字ルール・写真・PDFの変更は行っていない。JS3ファイルの構文検査と `git diff --check` は問題なし。

今回の範囲に残る実装課題はない。次工程ではCMS接続時に実データからの総件数・ページ数と記事詳細の対応を優先して確認する。多数ページの実データを追加するまで、状態確認にはこの見本を使用する。

## 17. TOP飲食出店ボタン・SP工程の配置

現在の配置仕様は第9章の「小見出し・ボタン」「工程・添付・開閉」を正本とする。ボタンの文言・詳細リンク・応募フォームの準備中状態は維持し、TOPの20ft／40ftと暗色ボタンのデザイン見本に同じ組み合わせを使う。見本専用CSSで実部品を補正しない。工程のHTMLは変更せず、各工程内の横組みはPC/SPとも適用する。番号の書体・32pxのサイズなど文字仕様は維持する。

### 変更・確認記録

- 実装・見本・仕様の変更：`assets/css/style.css`、`assets/css/subpage.css`、`docs/components.html`、`docs/DESIGN_SYSTEM.md`、`docs/DESIGN_GUIDELINES.md`、`docs/CODING_GUIDELINES.md`。
- `style.css` はTOP用セレクターだけをSP縮小ルールから外した。フォームのpair／mixedに関するルールは作業開始時と同一で、実際のフォーム・応募／PDFの計算済みスタイルも変更前と照合した。
- `subpage.css` は768px未満の工程だけを2列化。工程のDOMと読み順はそのままで、768px以上の文字・余白・罫線・3列表示は変更前と一致した。
- TOP・採用のHTML本文は変更していない。CSS参照URLの更新値は `20261107-buttons-process-1`。参照値だけを更新した15HTMLは、`index.html`、`business/index.html`、`company/index.html`、`recruit/index.html`、`arkgarden-recruit/index.html`、`works/index.html`、`news/index.html`、`news/sample-news/index.html`、`contact/index.html`、`contact/confirm/index.html`、`contact/complete/index.html`、`recruit/apply/index.html`、`recruit/apply/confirm/index.html`、`recruit/apply/complete/index.html`、`privacy-policy/index.html`。
- 320／375／414／767／768／1024pxで確認した。TOPの20ft・40ftは両方とも320・375pxで同幅の縦並び、414・767pxで横並び。768pxではコンテナが2列になって各カードの利用可能幅が狭くなるため縦並び、1024pxでは横並び。横組みは内容幅を保って中央へ置き、縦組みはその容器の幅いっぱいに揃える。
- 全6幅で文字14px・丸矢印42px・高さ52px・左padding24px・最小gap16pxを測定。縦組みでは短いラベルの後ろの空きを広げ、丸矢印を右端に揃える。背景に応じた塗り・アウトラインは維持した。
- 見本と実ページの部品スタイルは一致。配置はビューポートだけでなく、見本の枠やTOPのカード内の利用可能幅で決まる。同じ利用可能幅を与えた場合も同じ折り返しになることを確認した。
- 全6幅で工程の番号32px・見出し20px（SP）・本文16px・見出し後12px（SP）・番号と右列の間16px、番号下margin0を測定。実ページ・見本とも、複数行の見出しと長い本文をブラウザ内で差し替えても重なりや横溢れを生じなかった。原稿は変更していない。
- 詳細リンクの20ft／40ft両アンカーへの遷移、準備中リンクのEnter操作でURLが変わらないこと、キーボードのfocus-visibleを確認した。文言・リンク先・準備中属性は維持している。
- 対象部品・フォーム比較・長文・リンク等367項目が通過。共通CSS使用ページ16ページ×6幅でも横溢れ・JavaScript例外なし。tokens.css、docs/components.css、全JSは変更していない。`git diff --check` も問題なし。

今回の範囲に残る個別調整はない。新しい配置のための追加JS・新規ファイルは不要だった。

## 18. NEWS先頭の固定募集告知

### 確定した表示仕様

- 部品は `assets/css/style.css` の `.news-announcement`。ラベルは既存の `.news__category.news__category--important` による「重要なお知らせ」、告知文は「寒川町相模川一之宮公園にて、飲食出店者を募集しています」、ボタンは黒い共通 `.action-button` の「募集概要を見る」。写真・日付は表示しない。
- 背景はtransparentとし、周囲のNEWSと一体にする。告知専用の白・グレー・ベージュの背景面、ラベルやボタンを囲む四角い背景を設けない。カテゴリの赤い枠と、ボタン本体・丸矢印の既存背景は維持する。
- 外枠は四辺とも `--rule-hair`（1px）・`--color-accent`。ラベルの赤と同じ色を使い、上辺だけを太くしない。TOPでは記事一覧と同じ `.news__content` に置き、左右端を揃える。
- 内余白と文章／ボタンの間は `--space-lg`、ラベル／告知文の間は `--space-md`。記事一覧までは隣接する `.news__list` の上marginで `--space-xl` を一度だけ取る。
- 告知文は第2章の小見出しトークン（PC24px／SP20px・700・1.5）。左揃えで自然に折り返す。専用の流動サイズや、サイト全体のトークン変更は行わない。
- 768px未満はラベル・告知文・ボタンを縦に配置し、768px以上は文章の右にボタンを置く。ボタンは共通の文字・padding・丸矢印を縮小せず、カード全体をリンクにしない。
- TOPは `href="#ark-garden"`、見本は `href="../index.html#ark-garden"`。詳細ページへの直接リンクにはしない。既存のアンカー移動とスクロール余白を使用し、新しいJSは追加しない。

### CMS化と募集終了時の管理

- TOPの固定asideは `.news__content` 直下、`#news-list.news__list` の外側にハードコードする。CMS化で記事ループに置き換えるのは `#news-list` の内側だけ。固定告知を記事件数・新着順・カテゴリ絞り込み・ページ送りに含めない。
- 削除した「飲食出店募集のお知らせ」をCMS記事として再掲載し、同じ告知を重複させない。他の記事の本文・日付・リンク・順序、NEWS一覧ページの静的試作データは維持する。
- 内容変更時は `index.html` の固定asideと、`docs/components.html#sample-news-announcement` の見本を同時に更新し、本章を修正する。見本へ技術説明を表示しない。
- 募集終了時はTOPと見本の固定aside、見本の不要になる見出し・容器を削除する。記事一覧は残し、TOP下部の募集内容・応募導線は別途確認して更新する。下部セクションや画像を自動的に削除しない。関連CSSは全使用先の参照がなくなってから整理する。

### 旧告知と共用画像の整理

- ヒーロー直下の告知HTMLと、専用のレール・文字・ボタン・装飾・キャプションCSSを削除した。
- `.garden-entry-cta__media` は採用ページと本文＋画像の見本で使用する共用画像枠のため、既存の比率・罫線・画像指定を維持する。`.media-caption` とほかの共用キャプションも維持する。
- `assets/images/media/ark-garden-night-perspective.webp` はTOP下部・採用・見本で引き続き使うため削除しない。
- 見本の外側の配置は既存の `docs/components.css` の容器を使い、告知の背景・枠・文字・余白は共通CSSだけで表示する。

### 変更ファイルと確認結果

- 実装・見本・仕様の6ファイル：`index.html`、`assets/css/style.css`、`docs/components.html`、`docs/DESIGN_SYSTEM.md`、`docs/DESIGN_GUIDELINES.md`、`docs/CODING_GUIDELINES.md`。
- CSS参照URLのみを更新した14HTML：`arkgarden-recruit/index.html`, `business/index.html`, `company/index.html`, `contact/index.html`, `news/index.html`, `privacy-policy/index.html`, `recruit/index.html`, `works/index.html`, `contact/complete/index.html`, `contact/confirm/index.html`, `news/sample-news/index.html`, `recruit/apply/index.html`, `recruit/apply/complete/index.html`, `recruit/apply/confirm/index.html`。更新値は `20261107-news-notice-1`。これらのHTML本文は変更していない。
- 作業開始時の未コミット変更（TOPメインビジュアルの装飾文字と専用CSSの削除）を保持した。全JS、tokens.css、subpage.css、docs/components.cssは変更していない。
- 320／375／414／767／768／1024／1440pxで214項目を検証し、すべて通過。NEWS見出し→固定告知→4件の記事→一覧リンクの順、左右端、背景透過、四辺の色と1px幅、小見出しの文字値、共通ボタンのサイズを確認した。
- 見本とTOPで、実際のラベル・告知文・ボタン、背景・枠・余白の計算済み値が一致した。狭い幅でも欠け・重なり・横溢れを認めず、JS例外もなかった。
- 全7幅でボタンをEnter操作し、TOPの `#ark-garden` への移動と見出しが固定ヘッダーに隠れないことを確認。通常の滑らかなスクロールも375／1440pxで完了位置を確認した。
- 削除した募集行以外の4記事と、TOP下部 `#ark-garden` のHTMLは作業前と一致。共用画像枠とキャプションの計算済み値もSP／PCで一致した。完成イメージ画像は残している。
- 見本内の空のサンプル容器、ID重複、無効な仕様書の見本アンカーはない。`git diff --check` は問題なし。

## 19. TOP飲食出店募集の写真・FAQ導線

- 写真周辺のh3・pと文章用の容器、文章専用CSS、暗いグラデーションを削除する。写真を含むvisual・mediaと、画像の寸法・表示位置・alt・キャプションは保持する。削除する余白は文章用のpaddingであり、コンテナ紹介の上下paddingは別用途として維持する。
- FAQ導線の `.route-item / __label / __title / __arrow` は現行TOPで使われる実部品。日本語ラベルは `--type-label-*` と `--font-body` を参照し、PC/SPとも16px・700・1.5。色は既存の `--color-on-dark-muted`。
- 英字FAQはNoto Sans JP、PC32px／SP20pxとする。書体は `--font-body`、SPのサイズは `--type-heading-sm-size`、PCは `--type-heading-md-size` を参照する。既存の太さ600・行間1.05は維持する。トークン自体の数値は変更しない。
- 768px未満は日本語ラベルを上段、FAQを下段、右側に2段分を使う矢印を置く。日本語は自然に折り返し、高さは内容に合わせて伸びる。既存min-heightは最低限の操作領域であり、固定高で文章を切らない。
- 768px以上は日本語→FAQ→矢印の3列。左列は固定160pxをやめてmax-contentとし、必要な文字幅を確保する。列間は `--space-2xl`（標準設定で64px）とし、日本語とFAQの距離を確保する。PCのmin-heightは112px、上下paddingは既存の `--space-lg`（24px）を維持する。SPのmin-height132pxは変更しない。十分な幅では日本語を1行にし、右端の矢印までをリンクにする。既存の罫線・hover・active・focus-visibleを維持する。
- TOPのリンクは `arkgarden-recruit/#faq`、見本は `../arkgarden-recruit/#faq`。aria-labelは「飲食出店に関するよくある質問を見る」。飲食出店募集ページ側のFAQ見出しは変更しない。
- 見本は `docs/components.html#sample-garden-faq-route` に同じ実部品を置く。背景枠・配置は既存の資料用容器、部品はサイト共通CSSを使用する。技術説明は見本に表示しない。

### 変更ファイル・確認結果

- 実装・見本・資料の5ファイル：`index.html`、`assets/css/style.css`、`docs/components.html`、`docs/DESIGN_SYSTEM.md`、`docs/DESIGN_GUIDELINES.md`。
- CSS参照URLだけを更新した14HTML：`arkgarden-recruit/index.html`, `business/index.html`, `company/index.html`, `contact/index.html`, `news/index.html`, `privacy-policy/index.html`, `recruit/index.html`, `works/index.html`, `contact/complete/index.html`, `contact/confirm/index.html`, `news/sample-news/index.html`, `recruit/apply/index.html`, `recruit/apply/complete/index.html`, `recruit/apply/confirm/index.html`。更新値は `20261107-garden-photo-faq-4`。これらの本文と、飲食出店募集ページ側のFAQ見出しは変更していない。
- 320／375／414／767／768／1024／1440pxで182項目を確認し、すべて通過。写真の表示幅・高さ・object-fit・object-position、alt、右下キャプションとその共有CSSは変更前と一致した。文章の空ラッパーと専用paddingはなく、画像下からコンテナ紹介までの既存の64px余白だけが残る。
- FAQの日本語ラベル16px・700・1.5・Noto Sans JP・既存の補助色を確認。英字FAQはPC32px／SP20px、Noto Sans JP・600・1.05、PC列間64px。サイトと見本で同じ共通CSSを使い、文字・罫線・最低操作高が一致した。
- SPの上下配置、PCの3列配置、文字・矢印の重なりや横溢れがないこと、行全体のhover・focus-visible・Enter操作を確認した。TOP・見本とも飲食出店募集ページの `#faq` に移動し、既存の「よくある質問」見出しが固定ヘッダーに隠れない。
- TOPのbodyは、指定した写真周辺の文章・容器削除とFAQラベル・タイトル・読み上げ名の変更以外は作業前と一致した。全JS、tokens.css、subpage.css、docs/components.cssは変更していない。
- 見本のID重複・空のサンプル容器・無効な仕様書アンカーはなく、`git diff --check` も問題なし。新規JSは不要だった。
