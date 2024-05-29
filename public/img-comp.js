$( document ).ready(function() {

const container = document.querySelector('.container');
container.style.setProperty('--sWidth', `${container.offsetWidth}px`);
window.onresize = () =>{
    container.style.setProperty('--sWidth', `${container.offsetWidth}px`);
}
document.querySelector('.slider').addEventListener('input', (e) => {
  container.style.setProperty('--position', `${e.target.value}%`);
})

});