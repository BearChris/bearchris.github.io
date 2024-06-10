$( document ).ready(function() {

    let isdark = false;
    const root = document.querySelector(':root');
    $('.darkmode-btn').click(()=>{
      if(isdark == false){
          root.style.setProperty('--primary-bg','#000');
          root.style.setProperty('--primary','#FFF');
          root.style.setProperty('--primary-shadow','rgba(255,255,255,0.5)');
          $(this).find('.darkmode-ico').css('filter','invert(1)');
          isdark = true;
        }else{
            root.style.setProperty('--primary-bg','#FFF');
            root.style.setProperty('--primary','#000');
            root.style.setProperty('--primary-shadow','rgba(0,0,0,0.5)');
            $(this).find('.darkmode-ico').css('filter','invert(0)')
            isdark = false;
        }
    });
    
    });