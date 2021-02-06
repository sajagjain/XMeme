function MemesClient() {
    this.memes = [];

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
}

MemesClient.prototype.init = function () {
    this.getMemes((data) => {
        console.log(data);
        this.memes = [...data];
        this.showMemes();
        this.initEvents();
    });
};

MemesClient.prototype.initEvents = function () {
    var self = this;
    $(document).on('click', '#cancel-meme-btn', function () {
        $('.side-nav').removeClass('d-flex').addClass('d-none');
    });
    $(document).on('click', '.open-create', function () {
        $('.side-nav').addClass('d-flex').removeClass('d-none');
    });
    $(document).on('click', '#create-meme-btn', function () {
        var name = $('#name').val();
        var caption = $('#caption').val();
        var url = $('#url').val();
        var errMsg = [];
        
        if (name.trim().length == 0 || caption.trim().length > 500 || url.trim().length == 0) {
            if(name.trim().length == 0){
                errMsg.push("Name cannot be empty");
                
            }
            if(caption.trim().length > 500){
                errMsg.push("Caption text cannot be greater than 500 characters");
            }
            if(url.trim().length == 0){
                errMsg.push("Url cannot be empty");
            }

            self.createAlert(false,errMsg);
         } else {
            $.ajax({
                url: `/meme?name=${name}&caption=${caption}&url=${url}`,
                method: 'POST',
                success: (data) => {
                    if (data.id !== null) {
                        self.memes.unshift({ name, caption, url, created: new Date(), likes: 0 });
                        self.showMemes();
                    }
                    self.createAlert(true, "Meme Posted Successfully.");
                },
                err: function (err) {
                    console.log(err);
                    self.createAlert(false, [`Request failed with code ${err.status} : ${err.statusText}`]);
                }
            });
        }
    });
    $(document).on('blur', '#url', function () {
        var url = $(this).val();
        if (url.length > 0) {
            $('#img-preview').attr('src', url);
        } else {
            $('#img-preview').attr('src', 'https://i.imgflip.com/4wymt6.jpg')
        }
    });

    $(document).on('click', '.theme-changer', function () {
        $('body').toggleClass('dark');
    });

    $(document).on('click', '.close-alert', function () {
        $(this).parent().removeClass('d-flex').addClass("d-none");
    });

    $(document).on('click', '.meme-like-btn', function(){
        var currLikeBtnRef = this;
        var memeId = $(this).data('meme-id');
        var meme = self.memes.find(a => a.id == memeId);
        var noOfLikes = meme.likes;
        var hasLiked = $(this).hasClass('liked');
        if(hasLiked == false){
            $(this).addClass('liked');
            $(this).attr('name','heart');
            localStorage.setItem(memeId,true);
            noOfLikes += 1;
        }else{
            $(this).removeClass('liked');
            $(this).attr('name','heart-outline');
            localStorage.setItem(memeId,false);
            noOfLikes -= 1;
        }
        
        if(memeId !== null || memeId !== ''){
            $.ajax({
                url:`/meme/${memeId}`,
                method: 'PATCH',
                data: {
                    likes: noOfLikes
                },
                success: (data)=>{
                    meme.likes = noOfLikes;
                    $(currLikeBtnRef).siblings('p').text(`${noOfLikes} Likes`);
                },
                err: function(err){
                    
                }
            });
        }
    });

}

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

MemesClient.prototype.getMemes = function (cb) {
    $.ajax({
        url: '/meme',
        method: 'GET',
        success: (data) => {
            cb(data);
        },
        error: function (err) {
            console.log(err);
        }
    });
};

MemesClient.prototype.showMemes = function () {
    var html = '';
    if (this.memes && this.memes.length > 0) {
        for (var meme of this.memes) {
            html += `
                <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                    <div class="card shadow meme-card border-0 mt-5">
                        <div class="card-body">
                            <h5 class="card-title mb-0">${meme.name}</h5>
                            <p class="card-text">${meme.caption}</p>
                            <p class="badge minutes-ago">${this.timeSince(new Date(meme.created))} ago</p>
                        </div>
                        <div class="meme-image">
                            <img src="${meme.url}" class="card-img-top" alt="...">
                        </div>
                        <div class="card-body meme-action-container d-flex align-items-center">
                            <ion-icon data-meme-id="${meme.id}" class="meme-like-btn 
                                ${localStorage.getItem(meme.id) == "true"? 'liked':''}" 
                                name="${localStorage.getItem(meme.id) == "true"? 'heart':'heart-outline'}"'></ion-icon>
                            <p class="mb-0 ms-2">${meme.likes} Likes</p>
                        </div>
                    </div>
                </div>
            `;
        }
        $('#meme-container').html('').html(html);
    }
}

var client = new MemesClient();
client.init();