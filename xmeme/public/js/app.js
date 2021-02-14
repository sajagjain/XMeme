function MemesClient() {
    this.memes = [];
    this.top10 = [];

    //Helper Methods
    this.timeSince = function (date) {

        var seconds = Math.floor((new Date() - date) / 1000);
      
        var interval = seconds / 31536000;
      
        if (interval > 1) {
          return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }

    this.isValidHttpUrl = function (string) {
        let url;
        
        try {
          url = new URL(string);
        } catch (ex) {
          return false;  
        }
      
        return url.protocol === "http:" || url.protocol === "https:";
    }

    this.updatePreview = function(url,selector){
        if (url.trim().length == 0) {
            $(selector).attr('src', 'https://i.imgflip.com/4wymt6.jpg');
            return;
        }

        $.ajax({
            url: url,
            method: 'GET',
            success: function () {
                $(selector).attr('src', url);
            },
            error: function (err) {
                $(selector).attr('src', 'https://i.ibb.co/CsKZKds/WRONG-URL.png');
            }
        });
    }
}

//Initialization Method
MemesClient.prototype.init = function () {
    this.getMemes((data) => {
        console.log(data);
        this.memes = [...data];
        this.showMemes();
        this.initEvents();
    });
};

//Create Validation Alerts for Create Edit
MemesClient.prototype.createAlert = function (isGood, msg) {
    if (isGood) {
        $('.create-meme-success-container').find('span').text(msg);
        $('.create-meme-success-container').addClass('d-flex').removeClass("d-none");
        
        setTimeout(function () {
            $('.create-meme-success-container').removeClass('d-flex').addClass("d-none");
        }, 5000);
    } else {
        var allErrors = '';
        msg.forEach((err) => {
            allErrors += `<li>${err}</li>`;
        });
        $('.create-meme-err-container').find('ul').html(allErrors);
        $('.create-meme-err-container').addClass('d-flex').removeClass("d-none");

        setTimeout(function () {
            $('.create-meme-err-container').removeClass('d-flex').addClass("d-none");
        }, 5000);
    }
}

//Get 100 Latest Memes from Server
MemesClient.prototype.getMemes = function (cb) {
    $.ajax({
        url: '/memes',
        method: 'GET',
        success: (data) => {
            cb(data);
        },
        error: function (err) {
            console.log(err);
        }
    });
};

//Helps Refresh UI Cards
MemesClient.prototype.showMemes = function () {
    var html = '';
    if (this.memes && this.memes.length > 0) {
        for (var meme of this.memes) {
            html += `
                <div class="c-flex-card col-lg-3 col-md-6 col-sm-12 col-xs-12">
                    <div class="card shadow meme-card border-0 mt-5">
                        <div class="card-body">
                            <h5 class="card-title mb-0" style="margin-right:80px">${filterXSS(meme.name)}</h5>
                            <p class="card-text">${filterXSS(meme.caption)}</p>
                            <p class="badge minutes-ago">${this.timeSince(new Date(meme.created))} ago</p>
                        </div>
                        <div class="meme-image">
                            <img src="${filterXSS(meme.url)}" class="card-img-top" alt="..." onerror="if (this.src != 'https://i.ibb.co/3fs2L5C/image.png') this.src = 'https://i.ibb.co/3fs2L5C/image.png';">
                        </div>
                        <div class="card-body meme-action-container d-flex align-items-center justify-content-between">
                            <div class="d-flex">
                                <ion-icon data-meme-id="${meme.id}" class="meme-like-btn 
                                    ${localStorage.getItem(meme.id) == "true"? 'liked':''}" 
                                    name="${localStorage.getItem(meme.id) == "true"? 'heart':'heart-outline'}"'></ion-icon>
                                <p class="mb-0 ms-2">${filterXSS(meme.likes)} Likes</p>
                            </div>
                            <div class="d-flex">
                                <ion-icon data-meme-id="${meme.id}" class="open-edit" name="create-outline"></ion-icon>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        $('#meme-container').html('').html(html);
    }
}
