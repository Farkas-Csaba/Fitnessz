FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
#USER $APP_UID add this back in later, read after what it does
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Fitnessz.WebApi/Fitnessz.WebApi.csproj", "Fitnessz.WebApi/"]
COPY ["Fitnessz.Common.DataContext/Fitnessz.Common.DataContext.csproj", "Fitnessz.Common.DataContext/"]
COPY ["Fitnessz.Common.EntityModel/Fitnessz.Common.EntityModel.csproj", "Fitnessz.Common.EntityModel/"]
RUN dotnet restore "Fitnessz.WebApi/Fitnessz.WebApi.csproj"
COPY . .
WORKDIR "/src/Fitnessz.WebApi"
RUN dotnet build "./Fitnessz.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Fitnessz.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Fitnessz.WebApi.dll"]
