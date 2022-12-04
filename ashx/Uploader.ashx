<%@ WebHandler Language="C#" Class="Uploader" %>

using System;
using System.Web;
using System.IO;

public class Uploader : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        System.Collections.Specialized.NameValueCollection formData = context.Request.Form;
        string FolderPath = string.Concat(context.Request.PhysicalApplicationPath, "files", "\\", formData["FolderName"], "\\");
        // Check if file has been sent
        if (context.Request.Files.Count > 0)
        {
            try
            {
                // Save uploaded file            
                HttpPostedFile uploadedFile = context.Request.Files[0];
                uploadedFile.SaveAs(FolderPath + uploadedFile.FileName);
                context.Response.Write(string.Concat("{",
                                                        @"""UploadStatus"":""OK""",
                                                       "}")
                   );
            }
            catch (Exception ex)
            {
                context.Response.Write(string.Concat("{",
                                                        @"""UploadStatus"":""", ex, @"""",
                                                       "}"));
            }
        }
        else
        {
            context.Response.Write(string.Concat("{",
                                                 @"""UploadStatus"":""No file attached""",
                                                  "}"));
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

