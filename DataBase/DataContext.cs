// using MovieRatingAPI.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QCardPayment.Models;

namespace QCardPayment.DataBase
{
    /// <summary>
    /// Provides the Entity Framework Core database context for the delivery system.
    /// </summary>
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Products>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
                entity.Property(p => p.Description).HasMaxLength(1000);
                entity.Property(p => p.Price).HasPrecision(18, 2);
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
        }
    }
}