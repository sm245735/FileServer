<%@ WebHandler Language="C#" Class="Downloader" %>

using System;
using System.Web;
using System.IO;

public class Downloader : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "json/application";
        string FolderName = context.Request["FolderName"] != null ? context.Request["FolderName"] : "人事";
        string FileName = context.Request["FileName"] != null ? context.Request["FileName"] : "";
        string Type = context.Request["Type"] != null ? context.Request["Type"] : "Search"; // 搜尋或下載
        string RelativePath = HttpContext.Current.Server.MapPath("~/.");
        string FoloderPath = HttpContext.Current.Server.MapPath("~/.") + "\\files\\";
        if (Type == "Search")
        {
            string EachFoloderPath = string.Concat(context.Request.PhysicalApplicationPath, "files", "\\", FolderName);
            string[] FileArr = Directory.GetFiles(EachFoloderPath);
            string Result = "{\"data\": [";
            if (FileArr.Length > 0)
            {
                foreach (string EachFileFullDir in FileArr)
                {

                    FileInfo FileInfoObj = new FileInfo(EachFileFullDir);
                    Result = Result + string.Concat("{",
                                                        @"""FileName"":""", Path.GetFileName(EachFileFullDir), @""",",
                                                        @"""RelPath"":""", string.Concat("./files/", FolderName, "/", Path.GetFileName(EachFileFullDir)), @""",",
                                                        @"""CrtDt"":""", FileInfoObj.CreationTime.ToString("yyyy-MM-dd"), @""",",
                                                        @"""UpdDt"":""", FileInfoObj.LastWriteTime.ToString("yyyy-MM-dd"), @""",",
                                                        @"""Extension"":""", FileInfoObj.Extension, @"""",
                                                    @"},");
                }
                Result = Result.Substring(0, Result.Length - 1);
            }
            Result = Result + "]}";
            context.Response.Write(Result);
        }
        else if (Type == "Folder")
        {
            string[] FolderListArr = Directory.GetDirectories(FoloderPath);
            string FolderList = "[";
            if (FolderListArr.Length > 0)
            {
                foreach (string Folder in FolderListArr)
                {
                    FolderList = string.Concat(FolderList, @"{""FolderName"":""", Folder.Split('\\')[Folder.Split('\\').Length - 1], @"""},");
                }
            }
            else
            {
                FolderList = string.Concat(FolderList, @"{},");
            }
            FolderList = FolderList.Substring(0, FolderList.Length - 1);
            FolderList = FolderList + "]";
            context.Response.Write(FolderList);
        }        
        else
        {
            context.Response.Write("你想幹嘛 你媽逼");
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}