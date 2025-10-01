# خطوات نشر البلجن على Caido Store

## خطوة 0: إنشاء GitHub Repository (مطلوب أولاً!)

### إنشاء repository جديد:

1. اذهب إلى: https://github.com/new
2. Repository name: `EasyHunting-QuickScan-Plugin`
3. Description: `Security scanning plugin for EasyHunting platform integration with Caido`
4. تأكد أن Repository **Public** ✅
5. ✅ اختر "Add a README file"
6. اضغط "Create repository"

### رفع الكود للـ repository:

1. في الـ repository الجديد، اضغط "uploading an existing file"
2. اسحب كل الملفات من مجلد البلجن (عدا private.pem)
3. أو استخدم GitHub Desktop أو Git command line

## 1. إضافة Private Key إلى GitHub Secrets

**⚠️ يجب إنشاء repository أولاً!**

1. اذهب إلى GitHub repository الخاص بك
2. اضغط على Settings → Security → Secrets and variables → Actions
3. اضغط "New repository secret"
4. Name: `PRIVATE_KEY`
5. Value: انسخ المحتوى التالي:

```
-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIOaH8DXlwQ5Du0SPaXe2D+3FdAS3y/p+VVsoIdGLfv4r
-----END PRIVATE KEY-----
```

## 2. إنشاء Release

1. اذهب إلى Actions tab في repository
2. اضغط على "Release" workflow
3. اضغط "Run workflow"
4. انتظر حتى يكتمل الـ build

## 3. التقديم لـ Caido Store

1. اذهب إلى: https://github.com/caido/store/edit/main/plugin_packages.json
2. أضف هذا الـ entry في نهاية الـ JSON array (استبدل YOUR_USERNAME بـ username الخاص بك):

```json
{
	"id": "easyhunting-quickscan",
	"name": "EasyHunting QuickScan",
	"license": "MIT",
	"description": "Security scanning plugin for EasyHunting platform integration with Caido",
	"author": {
		"name": "EasyHunting Team",
		"email": "joker7@easyhunting.app",
		"url": "https://easyhunting.app"
	},
	"public_key": "MCowBQYDK2VwAyEAw8/+yVgN0V3X1Q8I3Mms8ZqV9wDpYBb0R76p+M3kR0I=",
	"repository": "YOUR_GITHUB_USERNAME/EasyHunting-QuickScan-Plugin"
}
```

3. اضغط "Commit changes..." في أعلى اليمين
4. اضغط "Propose changes"
5. اكتب عنوان الـ PR: `Add EasyHunting QuickScan`
6. املأ التفاصيل وضع علامة ✅ على الـ checkboxes
7. اضغط "Create pull request"
8. وقّع على Contributor License Agreement عند طلبه
9. انتظر المراجعة والموافقة

## ملاحظات مهمة:

- تأكد من أن الـ repository public
- تأكد من وجود release بالإصدار 1.0.0
- احتفظ بـ private.pem آمن ولا تشاركه
- الـ public key موجود في plugin-store-entry.json للمرجع
