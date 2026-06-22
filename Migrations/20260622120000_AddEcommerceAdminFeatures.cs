using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QCardPayment.Migrations;

public partial class AddEcommerceAdminFeatures : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Categories",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Slug = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ParentId = table.Column<int>(type: "int", nullable: true),
                SortOrder = table.Column<int>(type: "int", nullable: false),
                IsActive = table.Column<bool>(type: "bit", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Categories", x => x.Id);
                table.ForeignKey(
                    name: "FK_Categories_Categories_ParentId",
                    column: x => x.ParentId,
                    principalTable: "Categories",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateTable(
            name: "Coupons",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                DiscountType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Value = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                MinOrderAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                MaxUses = table.Column<int>(type: "int", nullable: true),
                UsedCount = table.Column<int>(type: "int", nullable: false),
                ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                IsActive = table.Column<bool>(type: "bit", nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_Coupons", x => x.Id));

        migrationBuilder.CreateTable(
            name: "Banners",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                Subtitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                CtaText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                CtaLink = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Section = table.Column<string>(type: "nvarchar(max)", nullable: false),
                SortOrder = table.Column<int>(type: "int", nullable: false),
                IsActive = table.Column<bool>(type: "bit", nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_Banners", x => x.Id));

        migrationBuilder.CreateTable(
            name: "StoreSettings",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                StoreName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                Tagline = table.Column<string>(type: "nvarchar(max)", nullable: false),
                LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                ContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                WhatsApp = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Facebook = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Instagram = table.Column<string>(type: "nvarchar(max)", nullable: false),
                TikTok = table.Column<string>(type: "nvarchar(max)", nullable: false),
                SeoTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                SeoDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_StoreSettings", x => x.Id));

        migrationBuilder.AddColumn<string>(
            name: "Slug",
            table: "Products",
            type: "nvarchar(200)",
            maxLength: 200,
            nullable: false,
            defaultValue: "");

        migrationBuilder.AddColumn<string>(
            name: "Sku",
            table: "Products",
            type: "nvarchar(100)",
            maxLength: 100,
            nullable: false,
            defaultValue: "");

        migrationBuilder.AddColumn<string>(
            name: "ImageUrl",
            table: "Products",
            type: "nvarchar(500)",
            maxLength: 500,
            nullable: false,
            defaultValue: "");

        migrationBuilder.AddColumn<decimal>(
            name: "CompareAtPrice",
            table: "Products",
            type: "decimal(18,2)",
            precision: 18,
            scale: 2,
            nullable: true);

        migrationBuilder.AddColumn<int>(
            name: "StockQuantity",
            table: "Products",
            type: "int",
            nullable: false,
            defaultValue: 100);

        migrationBuilder.AddColumn<bool>(
            name: "IsFeatured",
            table: "Products",
            type: "bit",
            nullable: false,
            defaultValue: false);

        migrationBuilder.AddColumn<int>(
            name: "CategoryId",
            table: "Products",
            type: "int",
            nullable: true);

        migrationBuilder.AlterColumn<string>(
            name: "Description",
            table: "Products",
            type: "nvarchar(2000)",
            maxLength: 2000,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(1000)",
            oldMaxLength: 1000);

        migrationBuilder.CreateIndex(
            name: "IX_Products_CategoryId",
            table: "Products",
            column: "CategoryId");

        migrationBuilder.CreateIndex(
            name: "IX_Categories_ParentId",
            table: "Categories",
            column: "ParentId");

        migrationBuilder.AddForeignKey(
            name: "FK_Products_Categories_CategoryId",
            table: "Products",
            column: "CategoryId",
            principalTable: "Categories",
            principalColumn: "Id",
            onDelete: ReferentialAction.SetNull);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Products_Categories_CategoryId",
            table: "Products");

        migrationBuilder.DropTable(name: "Banners");
        migrationBuilder.DropTable(name: "Coupons");
        migrationBuilder.DropTable(name: "StoreSettings");
        migrationBuilder.DropTable(name: "Categories");

        migrationBuilder.DropIndex(name: "IX_Products_CategoryId", table: "Products");

        migrationBuilder.DropColumn(name: "Slug", table: "Products");
        migrationBuilder.DropColumn(name: "Sku", table: "Products");
        migrationBuilder.DropColumn(name: "ImageUrl", table: "Products");
        migrationBuilder.DropColumn(name: "CompareAtPrice", table: "Products");
        migrationBuilder.DropColumn(name: "StockQuantity", table: "Products");
        migrationBuilder.DropColumn(name: "IsFeatured", table: "Products");
        migrationBuilder.DropColumn(name: "CategoryId", table: "Products");

        migrationBuilder.AlterColumn<string>(
            name: "Description",
            table: "Products",
            type: "nvarchar(1000)",
            maxLength: 1000,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(2000)",
            oldMaxLength: 2000);
    }
}
