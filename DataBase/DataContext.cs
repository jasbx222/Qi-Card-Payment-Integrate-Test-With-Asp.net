using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QCardPayment.Models;

namespace QCardPayment.DataBase;

public class DataContext : IdentityDbContext<AppUser>
{
    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }

    public DbSet<Orders> Orders => Set<Orders>();
    public DbSet<Payments> Payments => Set<Payments>();
    public DbSet<Products> Products => Set<Products>();
    public DbSet<OrderItems> OrderItems => Set<OrderItems>();
    public DbSet<Categories> Categories => Set<Categories>();
    public DbSet<Coupons> Coupons => Set<Coupons>();
    public DbSet<Banners> Banners => Set<Banners>();
    public DbSet<StoreSettings> StoreSettings => Set<StoreSettings>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Categories>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(200);
            entity.Property(c => c.Slug).HasMaxLength(200);
            entity.HasOne(c => c.Parent)
                  .WithMany(c => c.Children)
                  .HasForeignKey(c => c.ParentId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Products>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Description).HasMaxLength(2000);
            entity.Property(p => p.Slug).HasMaxLength(200);
            entity.Property(p => p.Sku).HasMaxLength(100);
            entity.Property(p => p.ImageUrl).HasMaxLength(500);
            entity.Property(p => p.Price).HasPrecision(18, 2);
            entity.Property(p => p.CompareAtPrice).HasPrecision(18, 2);
            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Orders>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.UserId).IsRequired().HasMaxLength(450);
            entity.Property(o => o.Status).IsRequired().HasMaxLength(100);
            entity.Property(o => o.TotalAmount).HasPrecision(18, 2);

            entity.HasMany(o => o.Items)
                  .WithOne(i => i.Order)
                  .HasForeignKey(i => i.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(o => o.Payments)
                  .WithOne(p => p.Order)
                  .HasForeignKey(p => p.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItems>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.UnitPrice).HasPrecision(18, 2);

            entity.HasOne(i => i.Product)
                  .WithMany()
                  .HasForeignKey(i => i.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Payments>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Status).IsRequired().HasMaxLength(100);
            entity.Property(p => p.Amount).HasPrecision(18, 2);
            entity.Property(p => p.FormUrl).HasMaxLength(500);
        });

        modelBuilder.Entity<Coupons>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Code).IsRequired().HasMaxLength(50);
            entity.Property(c => c.Value).HasPrecision(18, 2);
            entity.Property(c => c.MinOrderAmount).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Banners>(entity =>
        {
            entity.HasKey(b => b.Id);
            entity.Property(b => b.Title).HasMaxLength(300);
            entity.Property(b => b.ImageUrl).HasMaxLength(500);
        });

        modelBuilder.Entity<StoreSettings>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.StoreName).HasMaxLength(200);
        });
    }
}
