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
                }, 800);
            }
        });
});

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
        ],
        columns: [
            {
                title: "類型",
                data: "Extension",
                width: "10%",
                render: function (data, type) {
                    let LowData = data.toLowerCase();
                    if (LowData == ".txt") {
                        return '<img src="./assets/img/txt-icon.png" style="height:30px;" alt="Txt">';
                    }
                    if (LowData == ".xlsx" || LowData == ".xls") {
                        return '<img src="./assets/img/Excel-icon.png" style="height:30px;" alt="Xlsx/xls">';
                    }
                    if (LowData == ".doc" || LowData == ".docx") {
                        return '<img src="./assets/img/Word-icon.png" style="height:30px;" alt="Doc/Docx">';
                    }
                    if (LowData == ".ppt" || LowData == ".pptx") {
                        return '<img src="./assets/img/PowerPoint-icon.png" style="height:30px;" alt="Ppt/Pptx">';
                    }
                    if (LowData == ".jpeg" || LowData == ".jpg" || LowData == ".png") {
                        return '<img src="./assets/img/MetroUI-Apps-Windows8-Photos-icon.png" style="height:30px;" alt="Jpeg/Jpg/Png">';
                    }
                    if (LowData == ".rar" || LowData == ".zip" || LowData == ".7z") {
                        return '<img src="./assets/img/Rar-removebg-preview.png" style="height:30px;" alt="Rar/Zip/7z">';
                    }
                    if (LowData == ".pdf") {
                        return '<img src="./assets/img/PDF_file_icon.png" style="height:30px;" alt="Pdf">';
                    }
                    else {
                        return LowData;
                    }
                },
            },
            {
                title: "檔案名稱",
                data: 'RelPath',
                width: "66%",
                render: function (data, type) {
                    return '<a href="' + data + '" onclick="Logger(\'' + data.replace('./files/', '') + '\', \'Download\')" download>' + data.split('/')[data.split('/').length - 1] + '</a>';
                },
            },
            {
                title: "建立時間",
                data: "CrtDt",
                width: "12%",
            },
            {
                title: "修改時間",
                data: "UpdDt",
                width: "12%",
            }

        ],
    });
}