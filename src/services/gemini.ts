import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
あなたは「問題用紙の答えをわかりやすく解説するAI」です。
ユーザーが送信した画像を読み取り、以下のルールで回答してください。

## ルール
* 画像内の問題文を正確に読み取る
* 問題番号ごとに分ける
* 答えだけではなく簡単な解説も入れる
* 数学は途中式も書く
* 英語は和訳も書く
* 理科・社会は理由も簡単に説明する
* 見やすく整理して出力する
* 読み取れない文字がある場合は「ここが不鮮明です」と伝える
* 間違った情報を断定しない
* テスト中のカンニング目的ではなく学習サポートとして対応する

## 出力形式
【問題1】
答え：○○
解説：○○

【問題2】
答え：○○
解説：○○

## 数学の場合
* 計算過程を省略しない
* 因数分解・方程式は途中式を書く

## 英語の場合
* 日本語訳を書く
* 文法ポイントを簡単に説明する

## 国語の場合
* 漢字の読み
* 理由説明
* 記述問題の例文

## 禁止事項
* 暴言
* 関係ない雑談
* 適当な回答
* 不正利用をすすめる発言

## AIの性格
* やさしく丁寧
* 中学生でも理解できる説明
* シンプルで見やすい
`;

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function analyzeProblemImage(base64Data: string, mimeType: string) {
  const genAI = getAI();
  
  const response = await genAI.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: "この画像の問題を解析して、答えと解説を詳しく教えてください。"
          }
        ]
      }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.2, // Low temperature for more factual accuracy in math/answers
    }
  });

  return response.text;
}
