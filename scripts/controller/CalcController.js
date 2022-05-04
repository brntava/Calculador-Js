class CalcController {
    
    constructor(){

        this._audio = new Audio('../Calculadora-Js/Audio/click.mp3')
        this._audioOn = false;
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._displayCalcEl = document.querySelector('#display');
        this._dataEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');

        // Data Atual
        this._currentData;

        // Funçao que vai ser executada quando iniciar
        this.initialize();
        this.initButtonEvents();
        this.initKeyboard();
    }



    // Copiar e colar

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input)

        input.select();

        document.execCommand('Copy');

        // Usando o remove pq foi feito com svg
        input.remove;
    }

    pasteFromClipboard(){
        document.addEventListener('paste', e =>{

           let txt = e.clipboardData.getData('Text');

           this.displayCalc = parseFloat(txt);

           console.log(txt)

        })
    }

    //

    initialize(){

        setInterval(()=>{
            this.displayDate = this.currentData.toLocaleDateString('pt-br')
            this.displayTime = this.currentData.toLocaleTimeString('pt-br')
        }, 1000)

        this.setLastNumberDisplay();
        this.pasteFromClipboard();

        // Clicar para add som e tirar ele

        document.querySelectorAll('.btn-ac').forEach(item =>{

            item.addEventListener('dblclick', e =>{

                this.toggleAudio();

            })

        })
    }

    // Audio

    toggleAudio(){

        this._audioOn = (this._audioOn ? false : true)

    }

    // Tocar o audio

    playAudio(){

        if(this._audioOn){

            // Retonar pra 0 o tempo do audio
            this._audio.currentTime = 0;

            this._audio.play();
        }

    }

    // Eventos

    addEventListenerAll(element, events, fun){

        events.split(' ').forEach(event => {
            element.addEventListener(event, fun)
        })

    }

    // Eventos teclado

    initKeyboard(){
        document.addEventListener('keyup', e =>{

        this.playAudio();

        switch(e.key){
            case 'Escape':
                this.clearAll();
                break

            case 'Backspace':
                this.clearEntry();
                break

            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
                this.addOperation(e.key)
                break

            case 'Enter':
            case '=':
                this.calc();
                break

            case '.':
            case ',':
                this.addDot();
                break

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(e.key))
                break 

            case 'c':
                if(e.ctrlKey) this.copyToClipboard();
            }
        })
    }

    // Pega o ultimo valor do array

    lastOperation(){    
        return this._operation[this._operation.length - 1];
    }

    // Seta o ultimo valor do array

    setLastOperation(value){
        this._operation[this._operation.length -1] = value
    }

    // Verifica se é um operador

    isOperator(value){
        return (['-', '+', '*', '/', '%', ].indexOf(value) > -1)
    }

    // Faz o push

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();
        }
    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operation.length - 1; i >= 0; i--){

            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break
            }
        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }


    setLastNumberDisplay(){

        let lastNumber = this.getLastItem(false);

        for(let i = this._operation.length - 1; i >= 0; i--){

            // Se nao for um operador

            if(!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i];
                break
            }
        }


        if(!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;

    }

    // Pega o resultado

    getResult(){

        try{
            return eval(this._operation.join(" "));
        } catch{
            setTimeout(() => {
                this.setError();
            }, 1);
        }
    }

    // Faz o calculo

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        //

        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber]
        }

        if(this._operation.length > 3){

            last = this._operation.pop();

            this._lastNumber = this.getResult();

        } else if(this._operation.length == 3){

            this._lastNumber = this.getResult();
        }

        console.log('lastOperator', this._lastOperator);
        console.log('lastNumber', this._lastNumber);

        let result = this.getResult();

        if(last == '%'){

            result = result / 100;
            this._operation = [result];

        } else{
            this._operation = [result];

            // Se o last tiver algum conteudo
            if(last) this._operation.push(last)
        }

        this.setLastNumberDisplay();
    }

    // Add os valores no array

    addOperation(value){

        if(isNaN(this.lastOperation())){
            // Caso seja string

            if(this.isOperator(value)){
                // Troca o operador

                this.setLastOperation(value)

            } else{

                this.pushOperation(value)
                this.setLastNumberDisplay();
            }

        } else{

            if(this.isOperator(value)){
                
                this.pushOperation(value);

            } else{

                // Caso seja numero, vai transformar em string e vai concatenar

                let newValue = this.lastOperation().toString() + value.toString();
                this.setLastOperation(parseFloat(newValue))

                this.setLastNumberDisplay();

            }

        }

        console.log(this._operation)
    }

    // Add o ponto

    addDot(){

        let lastOperation = this.lastOperation();

        // Verificar se é uma string e se dentro dela tem o ponto ja
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation)|| !lastOperation ){
            this.pushOperation('0.');
        } else{
            this.setLastOperation(lastOperation.toString() + '.')
        }

        this.setLastNumberDisplay();

    }

    // Limpa tudo

    clearAll(){
        this._operation = [];
        this.setLastNumberDisplay();
        this._lastNumber = '';
        this._lastOperator = '';
    }

    // Limpa o ultimo valor

    clearEntry(){
        this._operation.pop();
        this.setLastNumberDisplay();
    }

    // Erro

    setError(){
        this.displayCalc = 'ERRO'
    }


    // Retorna o valor que foi clicado

    execBtn(value){

        this.playAudio();

        switch(value){
            case 'ac':
                this.clearAll();
                break

            case 'ce':
                this.clearEntry();
                break

            case 'soma':
                this.addOperation('+')
                break

            case 'subtracao':
                this.addOperation('-')
                break
            
            case 'multiplicacao':
                this.addOperation('*')
                break

            case 'porcento':
                this.addOperation('%')
                break

            case 'igual':
                this.calc('');
                break

            case 'ponto':
                this.addDot();
                break

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
                break    

            default:
                this.setError
                break
        }

    }

    initButtonEvents(){
        let button = document.querySelectorAll('#buttons > g, #parts > g')

        // Mostra cada item que ta sendo selecionado

        button.forEach((item, index) => {
            this.addEventListenerAll(item, 'click drag', () =>{

                // Vai mostrar só o nome da classe
                let txtBtn = item.className.baseVal.replace("btn-", "")

                this.execBtn(txtBtn)
            })

            this.addEventListenerAll(item, 'mouseup mousedown mouseover', () =>{
                item.style.cursor = 'pointer'
            })
        })
    }

    //

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    //

    get displayDate(){
        return this._dataEl.innerHTML
    }

    set displayDate(value){
        this._dataEl.innerHTML = value;
    }

    //

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if(value.toString().length > 8){
            this.setError();
            return false
        }

        this._displayCalcEl.innerHTML = value;
    }

    //

    get currentData(){
        return new Date()
    }

    set currentData(value){
        this._currentData = value;
    }

}