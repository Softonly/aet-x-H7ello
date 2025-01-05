import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

// .env dosyasını yükle
dotenv.config();

// Turso DB bağlantısını ayarla
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

// API handler fonksiyonu
export async function GET() {
  try {
    // SQL sorgusunu çalıştırıyoruz
    const result = await db.execute("SELECT * FROM productsTable"); // 'execute' kullanılıyor
    const products = result.rows; // 'result.rows' ürün verilerini içeriyor

    // Başarılı yanıt döndür
    return NextResponse.json(products);
  } catch (error) {
    console.error("Ürünler alınırken hata oluştu:", error);

    // Hata yanıtı döndür
    return NextResponse.json(
      { error: "Ürünler alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
