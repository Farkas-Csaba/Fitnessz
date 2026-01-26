using Fitnessz.Common.EntityModel;
namespace Fitnessz.Common.DataContext;
using Microsoft.EntityFrameworkCore;


public class ForumDbContext : DbContext
{
   public DbSet<Post> Posts { get; set; } = null!;
   public DbSet<ForumThread>? ForumThreads { get; set; }
   public DbSet<User>? Users { get; set; }
   public DbSet<Category> Categories { get; set; } = null!;

   public ForumDbContext(DbContextOptions<ForumDbContext> options) : base(options)
   {
   }
   protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
   {
   }

   protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.Entity<User>()
         .HasIndex(u => u.UserName) //why HasIndex I understand the IsUnique
         .IsUnique();
      modelBuilder.Entity<User>()
         .HasIndex(u => u.Email)
         .IsUnique();
   }
}