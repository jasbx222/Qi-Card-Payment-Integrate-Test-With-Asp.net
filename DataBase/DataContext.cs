// using MovieRatingAPI.Data;
using Microsoft.EntityFrameworkCore;
using QCardPayment.Models;

namespace QCardPayment.DataBase
{
    /// <summary>
    /// Provides the Entity Framework Core database context for the delivery system.
    /// </summary>
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<Orders> Orders => Set<Orders>();
        public DbSet<Payments> Payments => Set<Payments>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Orders>(entity =>
            {
                entity.HasKey(o => o.Id);
                entity.Property(o => o.Status).IsRequired().HasMaxLength(100);
                entity.Property(o => o.TotalAmount).HasPrecision(18, 2);

                entity.HasMany(o => o.Payments)
                      .WithOne(p => p.Order)
                      .HasForeignKey(p => p.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
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