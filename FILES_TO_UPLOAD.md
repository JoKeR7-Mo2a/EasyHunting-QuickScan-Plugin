# ملفات للرفع على GitHub

## ✅ الملفات المطلوب رفعها:

- caido.config.ts
- package.json
- pnpm-lock.yaml
- pnpm-workspace.yaml
- tsconfig.json
- eslint.config.mjs
- LICENSE
- README.md
- .gitignore
- packages/ (المجلد كامل)
- .github/ (المجلد كامل)
- plugin-store-entry.json
- PUBLISHING_STEPS.md

## ❌ الملفات التي يجب عدم رفعها:

- private.pem ⚠️ (سري جداً)
- node_modules/ (كبير وغير مطلوب)
- dist/ (يتم بناؤه تلقائياً)
- generate-keys.js (مؤقت)

## 📝 خطوات سريعة:

1. إنشاء repository على GitHub
2. رفع كل الملفات عدا private.pem
3. إضافة private.pem كـ Secret
4. تشغيل Release workflow
