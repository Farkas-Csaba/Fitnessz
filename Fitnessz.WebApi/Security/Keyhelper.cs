using Microsoft.IdentityModel.Tokens;

namespace Fitnessz.WebApi.Security;
using System.Security.Cryptography;
public class Keyhelper
{
    public static RsaSecurityKey GetPrivateKey()
    {
        //in a production app we should not save the keys to hard drive .xml but store it in something like
        //Azure KeyVautl or AWS KMS
        string path = "key.xml";
        RSA rsa = RSA.Create();

        if (File.Exists(path))
        {
            var xml = File.ReadAllText(path);
            rsa.FromXmlString(xml);
        }
        else
        {
            var xml = rsa.ToXmlString(true);
            File.WriteAllText(path, xml);
        }
        return new RsaSecurityKey(rsa);
    }
    
}