using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fitnessz.Common.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class PostTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Posts",
                newName: "Content");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Posts",
                newName: "Title");
        }
    }
}
