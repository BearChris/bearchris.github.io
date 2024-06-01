$( document ).ready(function() {

    let isdark = false;
    const root = document.querySelector(':root');
    $('.darkmode-btn').click(()=>{
      if(isdark == false){
          root.style.setProperty('--iobg','#000');
          root.style.setProperty('--iotext','#FFF');
          $(this).find('.darkmode-ico').css('filter','invert(1)');
          isdark = true;
        }else{
            root.style.setProperty('--iobg','#FFF');
            root.style.setProperty('--iotext','#000');
            $(this).find('.darkmode-ico').css('filter','invert(0)')
            isdark = false;
        }
    });
    
    });