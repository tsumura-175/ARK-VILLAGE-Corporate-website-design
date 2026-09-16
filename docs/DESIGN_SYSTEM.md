# ARK LEAGUE デザインシステム

## 1. 役割

本書は、ARK LEAGUEコーポレートサイトで再利用するUI部品の仕様書です。

- `DESIGN_GUIDELINES.md`：ブランドの方向性とデザイン判断の原則
- `CODING_GUIDELINES.md`：HTML、CSS、JavaScriptの実装規約
- `DESIGN_SYSTEM.md`：再利用する部品の構造、状態、組み合わせ方
- `assets/css/tokens.css`：色、文字、余白、時間などの実値

ページ固有の見た目を増やす前に、本書の既存部品で表現できないか確認します。

## 2. 基礎要素

### レイアウト幅

- ページ全体：`.page-shell` と `--page-max`
- 通常コンテンツ：`--content-max`
- 下層ページ本文：`--content-narrow`
- 本文の最大行長：`--copy-max`
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

## 4. 下層ページコンポーネント

### Page Hero

- クラス：`.page-hero`
- 高さ：`--subpage-hero-height`
- 必須要素：`.page-hero__slash`、`.page-hero__title-mask`、`.page-hero__title-en`、`h1`、`.page-hero__rail`
- 英字と日本語以外の説明文やCTAは原則として置かない
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
- 英字タイトルと直下の日本語見出しの間隔は共通ルールを使い、個別ページやIDで上書きしない
- すべての画面幅で見出しを左上、本文をその下に置き、DOMの読み順と視覚上の順序を一致させる
- SPの見出しは `--section-title-indent` で赤い斜線用の余白を確保しつつ、ページ余白との合算が過大にならない値を使う
- 下層ページ本文は `--section-body-indent` で管理し、SPでは追加インデントを付けず、地図・画像・文章をページ本文幅へ戻す
- 768px以上では `--section-body-indent` を `--section-title-indent` に揃え、見出しと本文の共通軸を復元する
- 補助背景の白いコンテンツプレートは、SPでも左右対称の最小内余白を確保する
- 本文領域の最大幅には `--content-narrow` を使用し、モバイルでは利用可能幅をそのまま使う
- セクション間は罫線を置かず、共通の上下余白で区切る

### Business Content Variants

- 事業内容ページの共通見出しは維持し、本文には内容に応じた複数の表示形式を使う
- `.business-photo-grid`：メイン写真1点と補助写真2点による非対称モザイク。SPではメインを全幅、補助写真を2列、PCでは8:4の面積差を付ける
- `.business-capability-grid`：対応範囲を線画アイコンと短い項目名で示す横組み一覧。PCでは7:5の非対称列を固定し、行ごとの罫線位置を揃える
- `.business-text-panel`：写真を使わず、日本語のメッセージ、導入文、文章項目で構成する。メッセージは共通英字見出しより小さくする
- `.business-feature`：写真と説明文を左右に配置し、画像付きの事例項目を `.business-topic-list` で左右交互に展開する
- 画像を含むグリッドには `minmax(0, 1fr)` を使い、モバイルでは1列または2列へ縮退させる
- 角丸や強い影は使わず、既存の罫線、余白、赤いアクセントのルールを継承する

### Page Memory Point

- 下層ページはページごとに強いビジュアル構成を1つだけ設け、すべてのセクションを同じ強度にしない
- 企業概要ページは `.philosophy-feature` を記憶点とし、写真と理念文をPCで重ね、SPでは縦積みにする
- 事業内容ページは `.business-photo-grid` を記憶点とし、最初の事業だけを非対称写真構成にする
- 写真が未確定の場合も構造は維持し、クライアント支給後に同じ比率で差し替える
- 数字や実績は確定情報がある場合のみ強調し、ダミー数値をデザイン要素として追加しない

### Definition List

- クラス：`.definition-list`
- 会社情報や仕様など、項目名と値の組み合わせに使用する
- HTMLは `dl`、`dt`、`dd` を使用する
- モバイルは縦積み、タブレット以上は項目列と内容列へ分ける
- タブレット以上の項目列は最大10remとし、内容列との間隔を過度に広げない

### Split Content

- クラス：`.split-content`
- 地図と交通案内など、同じ階層の2要素に使用する
- モバイルは1カラム、十分な幅がある場合のみ2カラムにする
- 子要素の幅は必ず `minmax(0, 1fr)` で横溢れを防ぐ

### Map Embed / Access Card

- クラス：`.map-embed`、`.access-card`
- 地図は住所を併記し、外部のGoogleマップを開けるテキストリンクを設ける
- `iframe` には内容を説明する `title` を付け、モバイルで横溢れしない幅にする
- 交通案内は手段ごとにカードへ分け、英字種別、日本語見出し、経路・目安時間の順に記載する
- 時刻表などの配布資料は `assets/documents/` に置き、カード内にダウンロードリンクを設ける
- 所要時間は交通状況によって変わるため、目安であることを補足する

### Directional Symbols

- 丸ボタン内の右矢印は空の `.ui-arrow-icon` を使い、疑似要素で描画する
- NEWSや募集導線の単体矢印は `.ui-arrow-glyph` を併用する
- 外部リンクとダウンロード記号は `.ui-symbol` と用途別Modifierを使う
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

企業概要ページで確定した余白、見出し、情報表、アクセス構成を、今後の下層ページへ展開します。
