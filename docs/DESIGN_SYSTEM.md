# ARK LEAGUE デザインシステム

## 1. 役割

本書は、ARK LEAGUEコーポレートサイトで再利用するUI部品の仕様書です。2026-11-01時点の実装を基準とし、過去の案や未実装の構成は現行仕様として扱いません。

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

### 文字

- 英字タイトル：`--font-display`
- 日本語本文・UI：`--font-body`
- 大見出しは `--text-*` または専用の流動サイズトークンを使用する
- 本文の行間は原則 `1.8` から `2`

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

- TOPは `.recruit-facilities / .recruit-facility`、採用ページは `.recruitment-facilities / .recruitment-facility` で施設別にまとめる。スポーツパークの3件は両ページで `.recruit-facility__layout--park / .recruit-opening` を共用し、公園の採用ページ1件は `.recruitment-routes / .recruitment-route` で写真・職種・導線を見せる
- 採用専用の画像は `assets/images/recruit/` にWebPで格納する。複数セクションで使う場合は `assets/images/media/` に移し、重複保存しない
- 寒川町ストリートスポーツパークの3件はPCで画像とボタンの上端を揃え、本文と画像・画像とボタンの間をそれぞれ `--space-lg` 空ける。文章量が異なる分の空きは本文領域内に残し、文章を水増ししない

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
- 背景は `.content-section--base` と `.content-section--tinted` の2種類を共通バリエーションとして使用する
- `--base` は標準のペーパー色、`--tinted` は同系色の濃度差と右側の部分的な設計補助線でセクションを区切る
- 原則として基本背景と補助背景を交互に使い、ページ固有の任意色や強い装飾を追加しない
- 設計補助線は縦線1本、長さの異なる横線2本、小さな赤い基準マークで構成し、全面反復パターンにはしない
- `--tinted` の本文領域は角丸や影のない白いコンテンツプレートとし、section-titleはプレートの外に残す
- コンテンツプレートは情報をまとめる大きな面として使い、内部の項目を個別の白いカードへ分割しない
- セクション全体の実背景色は `--section-surface` で管理する
- コンテンツの実背景色は `--content-surface` で管理し、前景の罫線部品にも同じ値を使用する
- 設計補助線はコンテンツプレートの背後へ透過させず、周囲の余白部分だけに見せる
- 見出し領域と本文領域を `.content-section__grid` で管理する
- 見出しはトップページと同じ `.section-heading` / `.section-title` を使い、赤い斜線、大きな英字、小さな日本語の順で統一する
- 英字タイトルと日本語見出しのサイズ・行間・間隔・文字色は共通ルールを使い、個別ページやIDで上書きしない。見出しは親領域の利用可能幅いっぱいを使い、収まる場合は日本語を英字の最終行の右隣に置く。共通スクリプトが親領域の右端と日本語の文字幅を比較し、収まらない場合だけ日本語を英字の下へ左揃えで置く。英字は語の途中で分割しない
- `.section-title` の直下には装飾の斜線、`.section-title__en`、`h2`、必要な場合のみ `.section-title__description` をこの順で置く。英字と日本語を個別のラッパーで囲まない。1行・複数行の共通見本は `docs/components.html#sample-section-title` で確認する
- 下層KVの英字・日本語の文字サイズはトップKVと同じルールを使う。共通見本は `docs/components.html` とする
- すべての画面幅で見出しを左上、本文をその下に置き、DOMの読み順と視覚上の順序を一致させる
- SPの見出しは `--section-title-indent` で赤い斜線用の余白を確保しつつ、ページ余白との合算が過大にならない値を使う
- 下層ページ本文は `--section-body-indent` で管理し、SPでは追加インデントを付けず、地図・画像・文章をページ本文幅へ戻す
- 768px以上では `--section-body-indent` を `--section-title-indent` に揃え、見出しと本文の共通軸を復元する
- 補助背景の白いコンテンツプレートは、SPでも左右対称の最小内余白を確保する
- 本文領域の標準最大幅には `--content-narrow` を使用し、モバイルでは利用可能幅をそのまま使う。写真・一覧・地図などは `.content-section__body--wide` でページ本文幅まで広げ、文章は必要に応じて `.content-section__body--editorial` または `.content-section__body--readable-copy` で行長を抑える
- セクション間は罫線を置かず、共通の上下余白で区切る

### Business Detail Pattern

- 事業内容ページの4事業は「共通見出し、メッセージ、説明文、写真、アイコン項目」の順序で統一する
- 現在は対応写真が各事業1枚のため、`.business-media` で静止表示する。同一写真を複数枚のスライダーとして繰り返さない
- 4事業のコンテンツ領域は共通してページ本文幅まで使う。リード・説明文の読み幅は維持し、写真・対応項目の一覧を広く見せる
- `.business-media` はSPで4:3、768px以上で2:1の表示枠を使い、最大幅は `--content-max` とする。画像は `object-fit: cover` で収める
- 各事業につき複数の意味の異なる写真が揃った時点でのみ、ページネーションと自動再生を伴うスライダーを新設する
- `.business-capability-grid`：対応範囲を線画アイコンと短い項目名で表示する。現在の4事業の項目数は順に4・6・5・6。`--four` はPCで2列×2行、`--six` は3列×2行、`--five` は上段3項目・下段2項目を左揃えにする。5項目の上段3番目にも下罫線を残し、段の境界を揃える。汎用の `--three` は3列に対応する
- アイコン付き一覧の実物見本は `components.html#sample-icons-four`、`#sample-icons-five`、`#sample-icons-six`。事業内容と同じSVG・クラス・表示アニメーションを使用する。「パフォーマンス出演」は既存のメガホンSVGを使う。
- SPではアイコン項目を1列、768px以上では2列、1024px以上では項目数に応じた列数へ展開する。5項目のタブレット表示では末尾が2列分を使う
- セクション内部の構造は統一しつつ、基本背景と補助背景を交互に使用してページ全体のリズムを保つ
- 角丸や強い影は使わず、既存の罫線、余白、赤いアクセントのルールを継承する

### Page Memory Point

- 下層ページはページごとに強いビジュアル構成を1つだけ設け、すべてのセクションを同じ強度にしない
- 企業概要の `.philosophy-feature` は写真・上下罫線・内部の追加上下余白を使わず、理念を文字組みで見せる。`.page-shell` 内の `.content-section__body--balanced` に入れ、左右に `--section-body-indent` を取る。リードは39px、本文は16px・`--color-section-title`。1024px以上でリードと本文を2列にする。
- 企業概要の会社概要とアクセスの間に、`.clients-grid` で取引先一覧を置く。提案用の支給ロゴ14点を、自治体3件・企業等11件の指定順で掲載する。元画像の縦横比・色・透過を保持した可逆圧縮WebPを使い、仮素材の注記は表示しない。既存の2・3・5列の切り替えを維持する。`clients-grid__logo--wide / --compact / --small` で見かけの大きさを調整し、X GAMES JAPANには `--on-dark` で暗色背景を敷く。X GAMESの画像本体は約64×87px、JTは64×53pxを上限とし、小さい原画像の拡大を避ける。元資料は `頂いた資料/修正内容/取引先ロゴ_提案用/` で保持し、見本は `components.html#sample-clients`。
- 事業内容ページは写真枠とアイコン一覧の反復をページ固有の視覚言語とし、背景の交互切り替えで単調さを抑える。写真が各事業1枚の間は静止表示とする
- 写真が未確定の場合も構造は維持し、クライアント支給後に同じ比率で差し替える
- 数字や実績は確定情報がある場合のみ強調し、ダミー数値をデザイン要素として追加しない

### Works / News / Contact / Privacy

- 実績一覧は `.works-list` / `.work-entry` を使用し、SPでは1列、768px以上では2列、1024px以上では3列とする。詳細ページのない実績にはリンクを付けない。カテゴリは「すべて」とExcelの「大会運営/企画」「大会運営」「パーク運営/監修」「パーク監修」「自治体連携」の5種類をそのまま使い、既存のフィルター・ページ送りで絞り込む。1ページ12件を表示し、カテゴリ変更時は1ページ目に戻す。TOPの `.work-panel` と一覧の `.work-entry` は共通データとカード生成処理を使用し、写真の表示比率は4:3で揃える。Excelにない説明は追加しない
- ニュース一覧は `.news-filter` / `.news-index-list` / `.news-pagination` を使用し、1ページ10件を表示する。SP（767px以下）はネイティブのプルダウン、タブレット・PC（768px以上）は従来のボタンでカテゴリを選択する。両UIの選択肢はJSの同じカテゴリ定義から生成し、表示幅を切り替えても選択状態を共有する。カテゴリ変更時は新しい順に並べ、ページ番号を1へ戻す。ページ送りは前後・現在ページ周辺・先頭末尾を表示し、離れた番号は省略記号でつなぐ。SPでは先頭末尾と省略記号を隠し、操作可能な前後と現在付近を残す
- ニュース一覧の各行はTOPと同じ `.news__item` / `.news__date` / `.news__category` / `.news__arrow` を使い、`news-index-list` は一覧の容器としてのみ使う。日付フォント、本文サイズ、単体矢印、通常カテゴリのホバー色、重要項目の赤い罫線・太字・赤い矢印を共通化する。記事詳細のメタ情報も同じ日付・カテゴリ表現を使い、一覧へ戻る導線には `.text-link` を使う。記事詳細は画像を省略可能な本文構造とし、PCでは左端を揃えたまま記事ヘッダーと写真の幅で右側の余白を整える
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
- 最低確認幅：320px、375px、768px、1280px、1440px
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
- リード `.content-section__lead` は最大32px、字間0、`text-wrap: pretty`。不要な強制改行をせず、長い日本語は `.content-section__lead-phrase` で意味のまとまりを示す。768px以上でまとまりの途中分割を避け、SPは自然に折り返す。
- 会社情報は標準幅、理念は `--balanced`、取引先・アクセスは `--wide`。事業内容は `.business-detail` が本文を広げ、説明文の読み幅を維持する。
- 採用のカード・写真・表・工程は `--wide`。WORK STYLE・JOBSは `--readable-copy` を併用する。飲食出店募集は写真・図面・表を広げ、FAQは標準幅とする。
- ニュース本文は左右のインデントを対称にする。お問い合わせ・求人応募の入力・確認・完了は最大68remを共用する。
- 実物見本：`components.html#sample-copy-width`。

### 小見出し・ボタン

- `.content-groups` は関連項目の容器。間隔はSPが `--space-xl`、768px以上が `--space-2xl`。
- `.content-group` と `.content-group__title` は小見出し＋本文の組。日本語見出しは20〜25px、行間1.5、内部間隔 `--space-lg`。募集要項の注記と個別職種も別のグループにして関係を示す。
- `.document-link-row` は説明の下に資料ボタンを左揃えで配置する。未提供の資料は `.action-button--disabled` を使う。
- PDFは `.action-button.action-button--outline` と `.ui-download-icon` を共用する。実URL、`download` 属性、資料を区別できる読み上げ名を付ける。
- `.contact-actions` は中央配置。SPの2つの主要ボタンは `--pair` または `.garden-container__actions` で横並び。主要ボタン＋補助リンクには `--mixed` を使う。単独ボタンに新たな2列指定を付けない。
- アンカー先は `.content-anchor` を使い、固定ヘッダーを避ける。確認画面からの戻るボタンは「修正する」に統一する。

### 工程・添付・開閉

- `.detail-feature` は本文と写真の2要素。768px未満は縦、以上は等幅2列。通常写真は4:3、図面は `--contain` で切り抜かない。完成イメージは `.garden-entry-cta__media` と `.media-caption` を再利用し、キャプションを右下へ置く。
- `.process-list` は意味のある順序を持つ工程の `ol`。番号は `.process-list__number` に分離してAntonio・700とし、768px未満は縦、以上は3列。装飾的なSECTION番号を付けない。
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
- TOPは `.recruit-facilities / .recruit-facility`、採用ページは `.recruitment-facilities / .recruitment-facility`。スポーツパークは両ページで `.recruit-facility__layout--park / .recruit-opening` を共用し、文字→画像→ボタン、罫線、PC3列を揃える。
- 公園の採用カードは `.recruitment-routes / .recruitment-route`。バナー上の `recruitment-route__number` による「01」は表示しない。画像と周囲の文言は保持する。
- 本文の順序は募集区分→WORK STYLE→JOBS→FLOW。WORK STYLEは会社紹介と働く環境、JOBSは仕事内容・人物像・募集要項、FLOWは応募→面接→採用発表。
- WORK STYLE・JOBSの内容は支給「採用情報_公園.pdf」に基づく。根拠のない働きやすさや条件を創作せず、給与・人数等の「（仮）」を保持する。
- WORK STYLEのリードは「公園の日常と、<br />地域のにぎわいを支える。」。右の画像は `assets/images/media/ark-garden-night-perspective.webp` を共用し、「完成イメージ」を右下に表示する。
- TOPの公園側左画像は `placeholder/sample-1.webp`、求人バナーは `recruit/ichinomiya-park-staff.webp`。スポーツパークの受付・運営は `recruit/samukawa-street-sports-park-operations.webp`、講師は `recruit/staff-instructor-cleaning.webp`、アルバイト・清掃は `recruit/samukawa-street-sports-park-cleaning.webp`。
- 採用メイン・求人応募3画面のKVは `recruit/staff-instructor-cleaning.webp` を共用。`.page-hero--image-top` の現行位置は `36% 34%`。
- WORK STYLE末尾・JOBS末尾は求人応募ボタンだけを表示し、「選考の流れを見る」のページ内リンクは置かない。FLOWセクション自体は残す。
- 実物見本：`components.html#sample-recruit`、`#sample-feature`。

### 求人応募の静的試作

- 必須は氏名・メール・希望職種・志望動機・履歴書添付・個人情報同意。電話番号と職務経歴は任意。現行フォームの希望職種は試作用で、JOBSの最新職種との同期が残っている。本番では条件と照合して確定する。
- `recruit-application.js` の保存先は `ark-garden-recruitment-preview`。お問い合わせは `ark-contact-preview` を使い、互いの保存内容を変更しない。
- 入力・確認・完了は現在それぞれ専用HTML。各本文アンカーへ遷移し、確認から修正に戻れる。実送信は行わない。
- 履歴書は名前だけを保持する。確認から戻る場合の仮必須判定を本番のファイル検証として流用しない。
- 確認画面へ直接アクセスし有効な入力がない場合は入力へ案内し、完了時は求人応募データだけを削除する。

## 11. 飲食出店募集

### TOPと内部導線

- ヘッダー・メニュー・フッターの「飲食出店募集」と期間限定CTAの「募集概要を見る」はTOPの `#ark-garden` へ接続する。階層に合わせた相対パスを使う。
- 期間限定 `.garden-entry-cta` は夜パースを右に置き、SPは縦、768px以上は2列。「完成イメージ」はHTMLの `.media-caption` として右下へ置く。
- TOPの紹介写真は960px以上で募集文を重ね、未満は画像の下へ文を置く。
- 20ft・40ft枠は768px以上で2列、未満は縦並び。画像は3:2の枠に `object-fit: contain` で全体を表示する。
- TOPの枠は `arkgarden/container-20ft.webp`（支給container_9）と `container-40ft.webp`（container_3）。AREAの図面とは別素材のため混同しない。
- 詳細は `arkgarden-recruit/#container-20ft` / `#container-40ft` へ接続。枠下は「よくある質問を見る」だけを表示し、`arkgarden-recruit/#faq` へ接続する。
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
3. 共通部品を変えたときは `components.html` と使用ページを320 / 375 / 768 / 1280 / 1440pxで確認する。
4. リンク先・画像・DOM内IDと読み上げ名、通常・hover・focus-visible・disabled、動きを減らす設定を確認する。
5. WORKSは正本Excel・共通データ・素材対応表を照合し、31件・5カテゴリ・12/12/7件・TOP最新6件の順序・クレジットを確認する。
6. フォーム変更時は必須検証・添付・確認・修正・完了・直接アクセスと、別フォームの保存データへの影響を確認する。
7. 日付の古さや参照の有無だけで資料を削除しない。役割と内容の重複を確認し、過去案が現行ルールと競合する記述だけを整理する。
