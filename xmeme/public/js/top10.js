MemesClient.prototype.initTop10 = function () {
    this.getMemesTop10(1,(data) => {
        console.log(data);
        this.top10 = [...data];
        this.showTop10Memes();
        this.initEvents();
        this.initEventsTop10();
    });
};

MemesClient.prototype.initEventsTop10 = function(){
    var self = this;
    $(document).on('change','#top10-range',function(){
        var curr = $('#top10-range').val() || 1;

        self.getMemesTop10(curr,(data) => {
            console.log(data);
            self.top10 = [...data];
            self.showTop10Memes();
        });
    });
}

MemesClient.prototype.getMemesTop10 = function (frame,cb) {
    $.ajax({
        url: `/memes/top10/${frame}`,
        method: 'GET',
        success: (data) => {
            cb(data);
        },
        error: function (err) {
            console.log(err);
        }
    });
};

MemesClient.prototype.showTop10Memes = function(){
    var html = '';
    if (this.top10 && this.top10.length > 0) {
        this.top10.forEach((meme,i) => {
            html += `
                <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                    <div class="card shadow meme-card border-0 mt-5">
                        <div class="card-body">
                            <h5 class="card-title mb-0">#${i+1} ${meme.name}</h5>
                            <p class="card-text">${meme.caption}</p>
                            <p class="badge minutes-ago">${this.timeSince(new Date(meme.created))} ago</p>
                        </div>
                        <div class="meme-image">
                            <img src="${meme.url}" class="card-img-top" alt="...">
                        </div>
                        <div class="card-body meme-action-container d-flex align-items-center">
                            <ion-icon data-meme-id="${meme.id}" class="meme-like-btn liked" 
                                name="heart"'></ion-icon>
                            <p class="mb-0 ms-2">${meme.likes} Likes</p>
                        </div>
                    </div>
                </div>
            `;
        });
        $('#top10-meme-container').html('').html(html);
    }
}
