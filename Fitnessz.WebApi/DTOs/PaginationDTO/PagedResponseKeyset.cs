namespace Fitnessz.WebApi.DTOs.PaginationDTO;

public record PagedResponseKeyset<T>
{
    public int Reference { get; init; }
    public List<T> Data { get; init; }

    public PagedResponseKeyset(List<T> data, int keyset)
    {
        Reference = keyset;
        Data = data;
    }
};