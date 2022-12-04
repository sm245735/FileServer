$(document).ready(function () {
    //拿資料夾名稱
    fetch(`ashx/Downloader.ashx?Type=Folder`)
        .then(function (response) {
            return response.json();
        })
        .then(function (FolderListJson) {
            let NabBarFolderListElement = document.getElementById("FolderList");
            let TableContainerElement = document.getElementById("TableContainer");
            for (let i = 0; i < FolderListJson.length; i++) {
                //依照files資料夾內結構建置左側選單                
                let li = document.createElement("li");
                li.innerHTML = `<a class="nav-link js-scroll-trigger" href="#${FolderListJson[i].FolderName.split('_')[1]}">${FolderListJson[i].FolderName.split('_')[0]}</a>`;
                li.setAttribute("class", "nav-item");
                NabBarFolderListElement.appendChild(li);

                //建置右側表格使用之table元素
                let section = document.createElement("section");
                section.innerHTML = `  <div class="resume-section-content">
                                          <h1 class="mb-0">${FolderListJson[i].FolderName.split('_')[0]}</h1>
                                          <br/>
                                          <div class="row">
                                            <div class="col-3">
                                                <input type="file" id="${FolderListJson[i].FolderName.split('_')[1]}files" name="${FolderListJson[i].FolderName.split('_')[1]}files" class="form-control"  multiple>
                                            </div>
                                            
                                          </div>
                                          <table id="${FolderListJson[i].FolderName.split('_')[1]}Dt" class="table table-striped table-bordered" style="width: 100%"></table>
                                       </div>`;
                section.setAttribute("class", "resume-section");
                section.setAttribute("id", FolderListJson[i].FolderName.split('_')[1]);
                TableContainerElement.append(section);

                //分隔用
                let hr = document.createElement("hr");
                hr.setAttribute("class", "m-0")
                TableContainerElement.append(hr);

                //匯入表格資料
                setTimeout(function () {
                    TableCreator(`${FolderListJson[i].FolderName.split('_')[1]}Dt`, FolderListJson[i].FolderName);
                    //增加EventListener
                    UploadFiles(`${FolderListJson[i].FolderName.split('_')[1]}files`, `${FolderListJson[i].FolderName}`);

                }, 800);
            }
        });
});

function UploadFiles(InputID, FolderName) {
    //依照ID獲取 blob
    //依照FolderName將資料送入
    let fileUploader = document.getElementById(`${InputID}`);
    fileUploader.addEventListener('change', (e) => {
        Swal.fire({
            title: '確定上傳?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '是',
            denyButtonText: `否`,
        }).then((result) => {
            if (result.isConfirmed) {
                for (let i = 0; i < e.target.files.length; i++) {
                    let form = new FormData();
                    form.append("file[files][]", e.target.files[i])
                    form.append("FolderName", FolderName);
                    fetch(`ashx/Uploader.ashx`, {
                        method: 'POST',
                        body: form,
                    }).then(function (response) {
                        return response.json();
                    }).then((UploadStatusObject) => {
                        if (UploadStatusObject.UploadStatus == "OK") {
                            //Add Log                            
                            Logger(FolderName + "/" + e.target.files[i].name, "Upload");
                            //重整頁面
                            Swal.fire({
                                title: '上傳完畢，將重整頁面',
                                icon: 'success',
                                confirmButtonText: '了解',
                            }).then((SecondResult) => {
                                if (SecondResult.isConfirmed) {
                                    //重整頁面
                                    location.reload();
                                }
                            })
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: '上傳失敗，請遠端連線至伺服器資料夾手動上傳。',
                            })
                        }
                    });
                }
            }
        })
    });
}

function Deleter(filePath) {
    Swal.fire({
        title: '已刪除的垃圾就像倒入大海，找不回來囉~~',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: '忍痛刪除',
        denyButtonText: `我再想想好了`,
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`ashx/Deleter.ashx?filePath=${filePath}`, {
                method: 'GET'
            }).then(function (response) {
                return response.json();
            }).then((DeleteStatusObject) => {
                if (DeleteStatusObject.DeleteStatus == "OK") {
                    Swal.fire({
                        title: '刪除完畢，已記錄於當日Log檔案中',
                        icon: 'success',
                        confirmButtonText: '了解',
                    }).then((SecondResult) => {
                        if (SecondResult.isConfirmed) {
                            //重整頁面
                            location.reload();
                        }
                    })
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: '刪除失敗，請遠端連線至伺服器資料夾手動刪除。',
                    })
                }
            });
        }
    });



}

function Logger(filePath, Movement) {
    fetch(`ashx/Logger.ashx?filePath=${filePath}&Movement=${Movement}`, {
        method: 'GET'
    })
}

function TableCreator(TableID, FolderName) {
    $(`#${TableID}`).DataTable({
        dom: '<"top"fl>rt<"bottom"ipB><"clear">', //如果不要按鈕就把B拿掉
        ajax: `ashx/Downloader.ashx?FolderName=${FolderName}&Type=Search`,
        buttons: ['excel'],  //如果不要按鈕就把這行拿掉
        columnDefs: [
            {
                "targets": 0, // your case first column
                "className": "text-center",
            },
            {
                "targets": 2,
                "className": "text-center",
            },
            {
                "targets": 3,
                "className": "text-center",
            },
            {
                "targets": 4,
                "className": "text-center",
            }
        ],
        columns: [
            {
                title: "類型",
                data: "Extension",
                width: "8%",
                render: function (data, type) {
                    let LowData = data.toLowerCase();
                    if (LowData == ".txt") {
                        return '<div style="display:none;">0</div><img src="./assets/img/txt-icon.png" style="height:30px;" alt="Txt">';
                    }
                    if (LowData == ".xlsx" || LowData == ".xls") {
                        return '<div style="display:none;">1</div><img src="./assets/img/Excel-icon.png" style="height:30px;" alt="Xlsx/xls">';
                    }
                    if (LowData == ".doc" || LowData == ".docx") {
                        return '<div style="display:none;">2</div><img src="./assets/img/Word-icon.png" style="height:30px;" alt="Doc/Docx">';
                    }
                    if (LowData == ".ppt" || LowData == ".pptx") {
                        return '<div style="display:none;">3</div><img src="./assets/img/PowerPoint-icon.png" style="height:30px;" alt="Ppt/Pptx">';
                    }
                    if (LowData == ".jpeg" || LowData == ".jpg" || LowData == ".png") {
                        return '<div style="display:none;">4</div><img src="./assets/img/MetroUI-Apps-Windows8-Photos-icon.png" style="height:30px;" alt="Jpeg/Jpg/Png">';
                    }
                    if (LowData == ".rar" || LowData == ".zip" || LowData == ".7z" || LowData == ".tar" || LowData == ".gz") {
                        return '<div style="display:none;">5</div><img src="./assets/img/Rar-removebg-preview.png" style="height:30px;" alt="Rar/Zip/7z">';
                    }
                    if (LowData == ".pdf") {
                        return '<div style="display:none;">6</div><img src="./assets/img/PDF_file_icon.png" style="height:30px;" alt="Pdf">';
                    }
                    else {
                        return LowData;
                    }
                    
                },
            },
            {
                title: "檔案名稱",
                data: 'RelPath',
                width: "65%",
                render: function (data, type) {
                    return '<a href="' + data + '" onclick="Logger(\'' + data.replace('./files/', '') + '\', \'Download\')" download>' + data.split('/')[data.split('/').length - 1] + '</a>';
                },
            },
            {
                title: "建立時間",
                data: "CrtDt",
                width: "10%",
            },
            {
                title: "修改時間",
                data: "UpdDt",
                width: "10%",
            },
            {
                title: "刪除",
                data: 'RelPath',
                width: "7%",
                render: function (data, type) {
                    //回傳格式  --> 人事_personnel/123333.txt
                    return `<div onclick="Deleter('${data.replace('./files/', '')}')" class="align-middle">
                                <div class="fa fa-trash" style="font-size:30px;color:red;cursor: pointer;" ></div>
                            </div>`;
                },
            }
        ],
    });
}