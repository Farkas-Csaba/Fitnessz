using Fitnessz.Common.EntityModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Fitnessz.Common.DataContext;
using Microsoft.EntityFrameworkCore;


public class ForumDbContext : IdentityDbContext<User, IdentityRole<int>, int>
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
      base.OnModelCreating(modelBuilder); 

      // 2. Your custom index logic below:
      modelBuilder.Entity<User>()
         .HasIndex(u => u.UserName)
         .IsUnique();

      modelBuilder.Entity<User>()
         .HasIndex(u => u.Email)
         .IsUnique();
   }
}