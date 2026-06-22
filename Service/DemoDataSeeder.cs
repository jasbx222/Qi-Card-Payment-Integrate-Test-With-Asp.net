using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QCardPayment.Constants;
using QCardPayment.DataBase;
using QCardPayment.Models;

namespace QCardPayment.Service;

/// <summary>
/// بيانات تجريبية غنية لأوربيتا — تُضاف بشكل idempotent (حسب Slug/SKU/Code)
/// ولا تُحذف البيانات الحقيقية عند الربط لاحقاً.
/// </summary>
public static class DemoDataSeeder
{
    public static async Task SeedAsync(DataContext db, UserManager<AppUser> userManager, IConfiguration config)
    {
        if (!config.GetValue("DemoData:Enabled", true))
            return;

        await SeedCategoriesAsync(db);
        await SeedProductsAsync(db);
        await SeedBannersAsync(db);
        await SeedCouponsAsync(db);
        await SeedStoreSettingsAsync(db);
        await SeedDemoUsersAndOrdersAsync(db, userManager);
        await RefreshImageUrlsAsync(db);
    }

    static string Pic(string seed, int size = 600) =>
        $"https://picsum.photos/seed/{seed}/{size}/{size}";

    static async Task RefreshImageUrlsAsync(DataContext db)
    {
        foreach (var p in await db.Products.ToListAsync())
        {
            if (string.IsNullOrEmpty(p.ImageUrl) || p.ImageUrl.Contains("unsplash.com"))
                p.ImageUrl = Pic($"orbita-{p.Sku.ToLowerInvariant().Replace("-", "")}");
        }

        foreach (var c in await db.Categories.ToListAsync())
        {
            if (string.IsNullOrEmpty(c.ImageUrl) || c.ImageUrl.Contains("unsplash.com"))
                c.ImageUrl = Pic($"orbita-cat-{c.Slug}", 500);
        }

        foreach (var b in await db.Banners.ToListAsync())
        {
            if (string.IsNullOrEmpty(b.ImageUrl) || b.ImageUrl.Contains("unsplash.com"))
                b.ImageUrl = Pic($"orbita-banner-{b.Section}", 1200);
        }

        await db.SaveChangesAsync();
    }

    static async Task SeedCategoriesAsync(DataContext db)
    {
        var categories = new[]
        {
            new Categories { Name = "شخصيات", Description = "شخصيات كارتونية من مجرات بعيدة", Slug = "characters", ImageUrl = Pic("orbita-cat-characters", 500), SortOrder = 1 },
            new Categories { Name = "ألعاب", Description = "ألعاب فضائية ومغامرات", Slug = "toys", ImageUrl = Pic("orbita-cat-toys", 500), SortOrder = 2 },
            new Categories { Name = "إكسسوارات", Description = "إكسسوارات بتصميم كوني", Slug = "accessories", ImageUrl = Pic("orbita-cat-accessories", 500), SortOrder = 3 },
            new Categories { Name = "ملصقات وفن", Description = "ملصقات ولوحات فنية", Slug = "stickers-art", ImageUrl = Pic("orbita-cat-stickers-art", 500), SortOrder = 4 },
            new Categories { Name = "حزم هدايا", Description = "مجموعات جاهزة للإهداء", Slug = "gift-bundles", ImageUrl = Pic("orbita-cat-gift-bundles", 500), SortOrder = 5 },
            new Categories { Name = "إسقاطات محدودة", Description = "إصدارات حصرية لفترة قصيرة", Slug = "limited-drops", ImageUrl = Pic("orbita-cat-limited-drops", 500), SortOrder = 6 },
        };

        foreach (var cat in categories)
        {
            if (!await db.Categories.AnyAsync(c => c.Slug == cat.Slug))
                db.Categories.Add(cat);
        }
        await db.SaveChangesAsync();
    }

    static async Task SeedProductsAsync(DataContext db)
    {
        var cats = await db.Categories.ToDictionaryAsync(c => c.Slug, c => c.Id);

        var products = new[]
        {
            P("ORB-001", "أسترو بير الفضائي", "astro-bear", "شخصية دبدوب فضائي ناعمة — رفيق كل مغامرة في أوربيتا", cats["characters"], 350000m, 400000m, 50, true),
            P("ORB-002", "روبوت نجمة", "star-robot", "روبوت كارتوني بإضاءة LED وصوت فضائي", cats["toys"], 280000m, null, 30, true),
            P("ORB-003", "سماعات المدار", "orbit-headphones", "سماعات لاسلكية بتصميم فضائي مضيء", cats["accessories"], 45000m, 60000m, 100, false),
            P("ORB-004", "شاحن النجوم", "star-charger", "شاحن سريع 65 واط بتصميم كوكبي", cats["accessories"], 25000m, null, 200, true),
            P("ORB-005", "حقيبة الكوكب", "planet-bag", "حقيبة ظهر كارتونية للأطفال والمسافرين الصغار", cats["accessories"], 55000m, null, 40, false),
            P("ORB-006", "مجموعة المجرة", "galaxy-set", "طقم ألعاب فضائية كامل — ١٢ قطعة", cats["toys"], 120000m, 150000m, 25, true),
            P("ORB-007", "قطة القمر", "moon-cat", "قط كارتوني بذيل مضيء — إصدار أوربيتا الحصري", cats["characters"], 420000m, 480000m, 15, true),
            P("ORB-008", "طائرة النيزك", "meteor-plane", "طائرة ورقية بتصميم نيزك ملون", cats["toys"], 18000m, null, 80, false),
            P("ORB-009", "مجموعة ملصقات المجرة", "galaxy-stickers", "٥٠ ملصقاً فضائياً مقاوماً للماء", cats["stickers-art"], 12000m, null, 150, false),
            P("ORB-010", "لوحة كوكب أوربيتا", "orbita-poster", "لوحة فنية A3 لغرفة الأطفال", cats["stickers-art"], 35000m, 45000m, 60, true),
            P("ORB-011", "حزمة المغامر الصغير", "adventurer-bundle", "شخصية + لعبة + ملصقات — هدية مثالية", cats["gift-bundles"], 185000m, 220000m, 20, true),
            P("ORB-012", "حزمة عيد الميلاد الفضائية", "birthday-space-bundle", "تغليف فضائي + ٣ كنوز مختارة", cats["gift-bundles"], 250000m, null, 12, true),
            P("ORB-013", "تنين المشتري", "jupiter-dragon", "تنين كارتوني نادر — إسقاط محدود", cats["limited-drops"], 550000m, 650000m, 8, true),
            P("ORB-014", "خوذة رائد الفضاء", "astronaut-helmet", "خوذة لعب بتأثيرات صوتية", cats["toys"], 95000m, null, 35, false),
            P("ORB-015", "مصباح الكوكب", "planet-lamp", "مصباح ليلي على شكل كوكب زحل", cats["accessories"], 78000m, 95000m, 45, true),
            P("ORB-016", "وحيد القرن النجمي", "star-unicorn", "شخصية وحيد قرن بريش متلألئ", cats["characters"], 390000m, null, 22, true),
            P("ORB-017", "لعبة بناء الفضاء", "space-blocks", "مجموعة بناء ٨٤ قطعة — محطة فضائية", cats["toys"], 145000m, 175000m, 18, false),
            P("ORB-018", "قلم مضيء", "glow-pen", "أقلام فضائية تتوهج في الظلام — طقم ٦", cats["accessories"], 15000m, null, 3, false),
            P("ORB-019", "بطاقات شخصيات أوربيتا", "character-cards", "مجموعة ٢٤ بطاقة شخصيات نادرة", cats["stickers-art"], 28000m, null, 70, false),
            P("ORB-020", "حزمة الأخوة الفضائية", "siblings-bundle", "حزمتان شخصيتين بسعر واحد", cats["gift-bundles"], 320000m, 380000m, 10, true),
            P("ORB-021", "محطة أوربيتا المصغّرة", "mini-station", "مجسم محطة فضائية للجمع — إصدار ١/٥٠٠", cats["limited-drops"], 890000m, null, 5, true),
            P("ORB-022", "دبّ الفضاء الذهبي", "golden-space-bear", "إصدار ذهبي محدود — ١٠٠ قطعة فقط", cats["limited-drops"], 720000m, 850000m, 4, true),
            P("ORB-023", "مجموعة ألوان المجرة", "galaxy-colors", "ألوان مائية بتدرجات كونية — ٢٤ لون", cats["stickers-art"], 42000m, null, 55, false),
            P("ORB-024", "روبوت القمر الصغير", "moon-bot-mini", "روبوت يمشي ويضيء — للأطفال ٣+", cats["toys"], 165000m, 195000m, 28, true),
        };

        foreach (var p in products)
        {
            if (!await db.Products.AnyAsync(x => x.Sku == p.Sku))
                db.Products.Add(p);
        }
        await db.SaveChangesAsync();
    }

    static Products P(string sku, string name, string slug, string desc, int catId, decimal price, decimal? compare, int stock, bool featured) =>
        new()
        {
            Sku = sku, Name = name, Slug = slug, Description = desc,
            CategoryId = catId, Price = price, CompareAtPrice = compare,
            StockQuantity = stock, IsFeatured = featured, IsActive = true,
            ImageUrl = Pic($"orbita-{sku.ToLowerInvariant().Replace("-", "")}")
        };

    static async Task SeedBannersAsync(DataContext db)
    {
        var banners = new[]
        {
            new Banners { Title = "ادخل بوابة أوربيتا", Subtitle = "ليس متجراً عادياً — عالم كارتوني حيّ بين النجوم", CtaText = "ابدأ الاستكشاف", CtaLink = "/products", Section = "hero", SortOrder = 1, IsActive = true, ImageUrl = Pic("orbita-banner-hero", 1200) },
            new Banners { Title = "الكنز الأسطوري", Subtitle = "اكتشاف الأسبوع — تنين المشتري", CtaText = "اكتشف الآن", CtaLink = "/products", Section = "featured", SortOrder = 1, IsActive = true, ImageUrl = Pic("orbita-banner-featured", 1200) },
            new Banners { Title = "نافذة الصيف الفضائية", Subtitle = "خصم ٢٠٪ على مختارات من ألعاب المجرة", CtaText = "ادخل الحدث", CtaLink = "/drops", Section = "event", SortOrder = 1, IsActive = true, ImageUrl = Pic("orbita-banner-event", 1200) },
            new Banners { Title = "حزم هدايا جاهزة", Subtitle = "تغليف فضائي مميز — اهدِ مغامرة كاملة", CtaText = "استكشف الحزم", CtaLink = "/collections", Section = "editorial", SortOrder = 1, IsActive = true, ImageUrl = Pic("orbita-banner-editorial", 1200) },
        };

        foreach (var b in banners)
        {
            if (!await db.Banners.AnyAsync(x => x.Section == b.Section && x.Title == b.Title))
                db.Banners.Add(b);
        }
        await db.SaveChangesAsync();
    }

    static async Task SeedCouponsAsync(DataContext db)
    {
        var coupons = new[]
        {
            new Coupons { Code = "ORBITA20", DiscountType = "percent", Value = 20, MinOrderAmount = 50000, MaxUses = 100, IsActive = true, ExpiresAt = DateTime.UtcNow.AddMonths(3) },
            new Coupons { Code = "SPACE50K", DiscountType = "fixed", Value = 50000, MinOrderAmount = 200000, MaxUses = 50, IsActive = true, ExpiresAt = DateTime.UtcNow.AddMonths(2) },
            new Coupons { Code = "WELCOME10", DiscountType = "percent", Value = 10, MinOrderAmount = null, MaxUses = null, UsedCount = 12, IsActive = true },
        };

        foreach (var c in coupons)
        {
            if (!await db.Coupons.AnyAsync(x => x.Code == c.Code))
                db.Coupons.Add(c);
        }
        await db.SaveChangesAsync();
    }

    static async Task SeedStoreSettingsAsync(DataContext db)
    {
        if (await db.StoreSettings.AnyAsync()) return;

        db.StoreSettings.Add(new StoreSettings
        {
            StoreName = "أوربيتا",
            Tagline = "مجرّة الكارتون — كل منتج مغامرة",
            LogoUrl = "",
            ContactEmail = "info@orbita.iq",
            ContactPhone = "07700000000",
            Address = "بغداد، العراق",
            WhatsApp = "07700000000",
            Facebook = "https://facebook.com/orbita.iq",
            Instagram = "https://instagram.com/orbita.iq",
            TikTok = "https://tiktok.com/@orbita.iq",
            SeoTitle = "أوربيتا — متجر الكارتون الفضائي في العراق",
            SeoDescription = "شخصيات، ألعاب، وكنوز كارتونية حصرية مع توصيل لجميع محافظات العراق"
        });
        await db.SaveChangesAsync();
    }

    static async Task SeedDemoUsersAndOrdersAsync(DataContext db, UserManager<AppUser> userManager)
    {
        var demoUsers = new[]
        {
            ("sara_traveler", "سارة", "07701234567"),
            ("ali_explorer", "علي", "07709876543"),
        };

        var userIds = new Dictionary<string, string>();

        foreach (var (username, _, phone) in demoUsers)
        {
            var user = await userManager.FindByNameAsync(username);
            if (user is null)
            {
                user = new AppUser { UserName = username, PhoneNumber = phone, PhoneNumberConfirmed = true };
                await userManager.CreateAsync(user, "Demo@123");
                await userManager.AddToRoleAsync(user, "Customer");
            }
            userIds[username] = user.Id;
        }

        if (await db.Orders.AnyAsync(o => o.UserId == userIds["sara_traveler"]))
            return;

        var products = await db.Products.OrderBy(p => p.Id).Take(8).ToListAsync();
        if (products.Count < 4) return;

        var orders = new[]
        {
            (userIds["sara_traveler"], OrderStatuses.Paid, new[] { (products[0].Id, 2), (products[2].Id, 1) }),
            (userIds["sara_traveler"], OrderStatuses.Paid, new[] { (products[5].Id, 1) }),
            (userIds["ali_explorer"], OrderStatuses.Paid, new[] { (products[1].Id, 1), (products[6].Id, 1) }),
            (userIds["ali_explorer"], OrderStatuses.Pending, new[] { (products[3].Id, 3) }),
            (userIds["sara_traveler"], OrderStatuses.AwaitingPayment, new[] { (products[10].Id, 1) }),
        };

        foreach (var (userId, status, items) in orders)
        {
            decimal total = 0;
            var orderItems = new List<OrderItems>();
            foreach (var (pid, qty) in items)
            {
                var prod = products.First(p => p.Id == pid);
                total += prod.Price * qty;
                orderItems.Add(new OrderItems { ProductId = pid, Quantity = qty, UnitPrice = prod.Price });
            }

            var order = new Orders { UserId = userId, Status = status, TotalAmount = total };
            db.Orders.Add(order);
            await db.SaveChangesAsync();

            foreach (var item in orderItems)
            {
                item.OrderId = order.Id;
                db.OrderItems.Add(item);
            }
            await db.SaveChangesAsync();
        }
    }
}
