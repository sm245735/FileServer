<%@ WebHandler Language="C#" Class="Deleter" %>

using System;
using System.Web;
using System.IO;

public class Deleter : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        string filePath = context.Request["filePath"] != null ? context.Request["filePath"] : "";
        string FileDir = string.Concat(HttpContext.Current.Server.MapPath("~/."), "\\files\\", filePath.Split('/')[0], "\\", filePath.Split('/')[1]);
        if (File.Exists(FileDir))
        {
            try
            {
                File.Delete(FileDir);
                Logger("Delete", FileDir);
                context.Response.Write(string.Concat("{",
                                    @"""DeleteStatus"":""OK""",
                                   "}"));
            }
            catch (Exception ex)
            {
                Logger("Delete Error", ex.ToString());
                context.Response.Write(string.Concat("{",
                                @"""DeleteStatus"":""", ex.ToString(), @"""",
                               "}"));
            }
        }
    }

    private static void Logger(string Movement, string FileDir)
    {
        string LogFileDir = string.Concat(HttpContext.Current.Server.MapPath("~/."), "\\log\\", DateTime.Now.ToString("yyyyMMdd"), ".log");
        if (!File.Exists(LogFileDir))
        {
            File.Create(LogFileDir);
        }
        using (StreamWriter sw = new StreamWriter(LogFileDir, true))
        {
            sw.WriteLine(String.Concat(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), "   ,", Movement, "   ,", FileDir, "   ,", GetIp()));
        }
    }

    private static string GetIp()
    {
        string ip = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
        if (string.IsNullOrEmpty(ip))
        {
            ip = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
        }
        return ip;
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}