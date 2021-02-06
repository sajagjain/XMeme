function MemesClient(){
    this.memes = [];    
}

MemesClient.prototype.init = function(){
    this.getMemes((data)=>{
        console.log(data);
        this.memes = [...data];
        this.showMemes();
        this.initEvents();
    });
};

MemesClient.prototype.initEvents = function(){
    var self = this;
    $(document).on('click','#cancel-meme-btn',function(){
        $('.side-nav').removeClass('d-flex').addClass('d-none');
    });
    $(document).on('click','.open-create',function(){
        $('.side-nav').addClass('d-flex').removeClass('d-none');
    });
    $(document).on('click','#create-meme-btn',function(){
        var name = $('#name').val();
        var caption = $('#caption').val();
        var url = $('#url').val();
        $.ajax({
            url: `/meme?name=${name}&caption=${caption}&url=${url}`,
            method: 'POST',
            success: (data)=>{
                if(data.id !== null){
                    self.memes.unshift({name,caption,url,created: new Date()});
                    self.showMemes();
                }
                self.createAlert(true,"Meme Posted Successfully.");
            },
            err: function(err){
                console.log(err);
            }
        })
    });
    $(document).on('keypress keyup keydown','#url',function(){
        var url = $(this).val();
        if(url.length > 0){
            $('#img-preview').attr('src',url);
        }else{
            $('#img-preview').attr('src','https://i.imgflip.com/4wymt6.jpg')
        }
    });

    $(document).on('click','.theme-changer',function(){
        $('body').toggleClass('dark');
    });

    $(document).on('click','.close-alert',function(){
        $(this).parent().removeClass('d-flex').addClass("d-none");
    });

}

MemesClient.prototype.createAlert = function(isGood, msg){
    if(isGood){
        $('.create-meme-success-container').find('span').text(msg);
        setTimeout(function(){
            $('.create-meme-success-container').removeClass('d-flex').addClass("d-none");
        },5000);
    }else{
        var allErrors = '';
        msg.forEach((err)=>{
            allErrors += `<li>${err}</li>`;
        });
        $('.create-meme-err-container').find('ul').text(allErrors);
    }
}

MemesClient.prototype.getMemes = function(cb){
    $.ajax({
        url: '/meme',
        method: 'GET',
        success: (data)=>{
            cb(data);
        },
        error: function(err){
            console.log(err);
        }
    });
};

MemesClient.prototype.showMemes = function(){
    var html = '';
    if(this.memes && this.memes.length > 0){
        for(var meme of this.memes){
            html += `
                <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                    <div class="card shadow meme-card border-0 mt-5">
                        <div class="card-body">
                            <h5 class="card-title mb-0">${meme.name}</h5>
                            <p class="card-text">${meme.caption}</p>
                        </div>
                        <div class="meme-image">
                            <img src="${meme.url}" class="card-img-top" alt="...">
                        </div>
                        <div class="card-body meme-action-container d-flex align-items-center">
                            <ion-icon class="meme-like-btn" name="heart-outline"></ion-icon>
                            <p class="mb-0 ms-2">100 Likes</p>
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