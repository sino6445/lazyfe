/*!
  hey, [lazyfe].js - v1.0.0 - 2024.10.28
  A fast, small and dependency free front-end framework (https://github.com/sino6445/lazyfe)
  (c) Sino Pan - @sino6445 - http://lazyfe.sino6445.link/
*/
;
(function(root, lazyfe) {
    if (typeof root.Lazyfe ==="undefined"){
        root.Lazyfe = lazyfe();
    }
})(this, function() {
    'use strict';
    //resolve bootstrap not defined warnning in js
    var bootstrap=window.bootstrap;
    //create unique view id
    const createUniqueId = (() => (id = 0, () => id++))();
    //const view id prefix
    let idPrefix="lazyfeViewModal-";
    
    const Lazyfe = {};
    Lazyfe.dialog=dialog;
    Lazyfe.alert = alert;
    Lazyfe.confirm = confirm;
    Lazyfe.progress=progress;
    Lazyfe.setProgress=setProgress;   
    Lazyfe.close=close;
    Lazyfe.setIdPrefix=setIdPrefix;
    Lazyfe.setMessage=setMessage;
    return Lazyfe;
 
    /* Private functions
     ************************************/
    function dialog (data) {
        if ((typeof data)==="string" || (typeof data)==="number"){
            data = {message:data};
        }      
        return showView(data);
    };

    function alert(data) {
        if ((typeof data)==="string" || (typeof data)==="number"){
            data = {message:data,disableClose:true};
        }
        return showView(data);
    };        

    function confirm(data){
        if ((typeof data)==="string" || (typeof data)==="number"){
            data = {message:data,disableClose:true};
        }            
        if (!data.hasOwnProperty("secondaryLabel")){
            data.secondaryLabel="取消";
        }
        return showView(data);
    };

    function progress (data){
        if ((typeof data)==="string" || (typeof data)==="number"){
            data = {message:data};
        }
        return showProgress(data);
    };

    function setProgress(viewModal,percentCompleted){
        $(viewModal).find(".progress-bar").css("width",percentCompleted+"%");
    };    

    function close(viewModal) {
        viewModal = viewModal || false;
        if (viewModal && (viewModal instanceof jQuery)){
            $(viewModal).remove();
            $(".modal-backdrop").remove();
        }
        else{
            let tmpModal = new bootstrap.Modal(document.getElementById(id));
            tmpModal.hide();
        }
    }
    /**
    * showView. show dialog
    * @param {Array} data - create dialog
    *  data.id The type of dailog can be empty string or success error. , default lazyfeViewModal 
    *  data.title dialog title , default empty string
    *  data.message dialog message , default empty string
    *  data.messageAlign message text align, default center
    *  data.primaryLabel - label for primary button ,default 確定
    * data.secondaryLabel  -label for secondary button ,default empty string
    *  data.primaryCallback - callback for secondary button ,default null
    * data.secondaryCallback  - callback when close button click ,default null
    * data.backdrop  - close dialog on tap outside ,default false
    * data.closeFocus  - selector to focus on close dialog , default null
    * data.reload  - reload pae , default false
    *data.size  - reload pae , default false
    * 
    */
    function showView(data) {
        data = data || {};
        data.id = data.id || idPrefix+createUniqueId();
        data.title = data.title || "";
        data.message = data.message || "";
        data.messageAlign = data.messageAlign || "center";
        data.primaryLabel = data.primaryLabel || "確定";
        //fool-proof message is number
        if ((typeof data.primaryLabel)==="number"){
            data.primaryLabel = data.primaryLabel.toSring();
        }
        data.secondaryLabel = data.secondaryLabel || "";
        data.backdrop = data.backdrop || false;
        data.primaryCallback = data.primaryCallback || null;
        data.disablePrimaryDismiss = data.disablePrimaryDismiss || false;
        data.secondaryCallback = data.secondaryCallback || null;
        data.disableSecondaryDismiss = data.disableSecondaryDismiss || false;
        data.closeFocus = data.closeFocus || null;//focus object after cl;ose view (css selector)
        data.closeCallback = data.closeCallback || null;
        data.reload = data.reload || false;//reload after close view
        data.size = data.size || "small";
        data.back = data.back || false;
        data.backCallback = data.backCallback || null;
        data.disableClose = data.disableClose || false;

        createView(data);

        return $("#"+data.id);
    };
    

    function createView(data){
        //id comflict,do nothing
        if($("#"+data.id).length){
            return;
        }
        //set dialog size
        let sizeClass=``;    
        if (data.size==="xlarge"){
            sizeClass=" modal-xl";
        }
        else if (data.size==="large"){
            sizeClass=" modal-lg";
        }
        else if (data.size==="small"){
            sizeClass=" modal-sm";
        }
        //init back
        let back=data.back?`<button type="button" class="btn-back" data-bs-dismiss="modal" aria-label="返回"></button>`:``;
        //init close
        let close=!data.disableClose?`<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`:``;
        //check element exists, if exists remove it first
        if ($("#"+data.id).length){
            $("#"+data.id).remove();
        }
        //init modal dismiss
        let primaryDismiss=!data.disablePrimaryDismiss?` data-bs-dismiss="modal"`:``;
        let secondaryDismiss=!data.disableSecondaryDismiss?` data-bs-dismiss="modal"`:``;
        //compose view html hidden
        let html=`<div class="modal fade" id="${data.id}" aria-modal="true" role="dialog" style="display: block;" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered${sizeClass}">
          <div class="modal-content">
            <div class="modal-header">
              ${back}
              <h5 class="modal-title">${data.title}</h5>
              ${close}
            </div>
            <div class="modal-body" style="text-align:${data.messageAlign}">
                <div class="lazyfe-message">
                    ${data.message}
                </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary"${secondaryDismiss}>取消</button>
              <button type="button" class="btn btn-primary"${primaryDismiss}>確定</button>
            </div>
          </div>
        </div>
      </div>
    `;
        //append to body
        $('body').append(html);
        //init primary btn
        let primaryBtn= $("#"+data.id+" .btn-primary");
        if (data.primaryLabel){
            primaryBtn.html(data.primaryLabel);
            primaryBtn.click(data.primaryCallback);
            primaryBtn.show();
        }
        else{
            primaryBtn.hide();
        }
        //init secondary btn
        let secondaryBtn= $("#"+data.id+" .btn-secondary");
        if (data.secondaryLabel){
            secondaryBtn.html(data.secondaryLabel);
            secondaryBtn.click(data.secondaryCallback);
            secondaryBtn.show();
            primaryBtn.addClass("col");//average width when defined two btn
        }
        else{
            secondaryBtn.hide();
        }
        //init back btn
        let backBtn=$("#"+data.id+" button.btn-back");
        if (data.back){
            backBtn.click(data.backCallback);
            backBtn.show();
        }
        else{
            backBtn.hide();
        }    
        //init close btn
        let closeBtn=$("#"+data.id+" button.btn-close");
        if (!data.disableClose){
            closeBtn.click(data.closeCallback);
            closeBtn.show();
        }
        else{
            closeBtn.hide();
        }
        //set is close when click outside
        if (data.backdrop===true){
            let tmpModal = new bootstrap.Modal(document.getElementById(data.id),{backdrop:'static',keybaord:false});
            tmpModal.show();
        }
        else{
            let tmpModal = new bootstrap.Modal(document.getElementById(data.id));
            tmpModal.show();
        };              
    }
    /**
    * showProgress.
    * @constructor
    * @param {Array} data - The data for dialog ,
    *  data.title dialog title 
    *  data.message dialog message
    *  data.fileName - file name label 
    *  data.canccelLabel - label for cancel button 
    *  data.cancelCallback - callback for cancel button
    * data.backdrop  - close dialog on tap outside
    */
    function showProgress(data){
        data = data || {};
        data.id = data.id || idPrefix+createUniqueId();
        data.title = data.title || "";
        data.message = data.message || "";
        data.messageAlign = data.messageAlign || "center";
        data.cancelLabel = data.cancelLabel || "取消";
        data.backdrop = data.backdrop || false;
        data.cancelCallback = data.cancelCallback || null;
        createProgress(data);

        return $("#"+data.id);
    }        

    function createProgress(data){
        //id comflict,do nothing
        if($("#"+data.id).length){
            return;
        }
        //check element exists, if exists remove it first
        if ($("#"+data.id).length){
            $("#"+data.id).remove();
        } 
        //compose view html hidden
        let html=`<div class="modal fade" id="${data.id}" style="display:block;">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-body">
                      <div class="lazyfe-info">
                        <p class="lazyfe-file-name"></p>
                        <span class="lazyfe-message">上傳中</span>
                      </div>
                      <div class="box-progress">
                        <div class="progress">
                          <div class="progress-bar" role="progressbar" style="width:0%;"></div>
                        </div>
                        <p></p>
                        <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">取消</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
        
        $('body').append(html);
        //init message (filename)
        $("#"+data.id+" .lazyfe-file-name").html(data.fileName+`...`);
        //init cancel btn
        $("#"+data.id+" .cancel-btn").click(data.cancelCallback);
        //remove dialog after modal is closed.
        $("#"+data.id).on('hide.bs.modal', function () {
            $("#"+data.id).remove();
        }); 

        if (data.backdrop===true){
            let tmpModal = new bootstrap.Modal(document.getElementById(data.id),{backdrop:'static',keybaord:false});
            tmpModal.show();
        }
        else{
            let tmpModal = new bootstrap.Modal(document.getElementById(data.id));
            tmpModal.show();
        };
    }
    
    function setIdPrefix(input){
        if(input){
            idPrefix=input;
        }
    }
    
    function setMessage(viewModal,message){
        $(viewModal).find(".lazyfe-message").html(message);
    }
});