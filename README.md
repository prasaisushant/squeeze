# Squeeze — 100% Client-Side Image Compressor

Squeeze is a minimalist, fast, and privacy-first web application designed to compress and convert images entirely within your browser. **No data is ever uploaded to a server.**

---

## 💡 The Problem & The Inspiration

Have you ever tried submitting documents, applications, or forms on government, educational, or corporate websites? If so, you've likely run into strict, unforgiving **file size limits** (e.g., *"File must be under 500 KB"*). 

To solve this, most people turn to popular online compression tools. However, when dealing with highly sensitive items—like ID cards, passports, certificates, or confidential tax documents—uploading them to an unknown third-party server feels unsafe and poses a massive privacy risk.

### The Breakthrough
Modern web browsers are incredibly powerful and come equipped with native, built-in image processing capabilities (like the HTML5 Canvas API). **Squeeze** was born out of a realization: *Why send confidential documents across the internet when your own device can do the heavy lifting safely and instantly?*

---

## 🛡️ Key Features

* **100% Client-Side Processing:** Your files never leave your computer. All compression takes place inside your browser sandbox. You can even use this tool entirely offline!
* **Local Format Conversion:** Need to change an image type to match rigid upload criteria? Squeeze allows you to seamlessly convert between **JPEG, PNG, and WebP** locally.
* **Bulk Queue Management:** Drop multiple files at once. Tweak settings for each file individually, preview the visual differences side-by-side, and check file sizes before downloading.
* **Smart Analytics:** Displays real-time stats tracking how many files you've processed, your average space savings, and the total data footprint you've shaved off.

---

## 🛠️ Built With

Squeeze is built using zero external heavy framework dependencies to remain lightweight, ultra-secure, and easy to audit:

* **HTML5 & CSS3** (Utilizing modern CSS variables and responsive grid layouts)
* **Vanilla JavaScript** (Leveraging native `Canvas`, `Blob`, and object URL APIs for seamless image manipulation)
* **Google Fonts** (DM Sans & DM Mono)

---

## 🚀 Live Deployment

Since Squeeze runs entirely on the client side without needing a backend or database, it is hosted statically and accessible to anyone right away. 

You can use the live application securely here:
👉 **[squeeze.sushantprasai.com.np](https://squeeze.sushantprasai.com.np)**

*(Tip: Because the application downloads entirely into your browser cache on first load, you can safely disconnect your Wi-Fi after opening the site and it will continue to compress and convert your files perfectly!)*

---

## 📝 License

This project is open-source and free to use. Modify it, self-host it, or tailor it to your own workflows!