import { LightningElement, wire } from 'lwc';
import generateResponse from '@salesforce/apex/ModelsAPIController.generateResponse';
import getModels from '@salesforce/apex/ModelsAPIController.getModels';

export default class ModelsAPITest extends LightningElement {

    prompt = '';
    response = '';
    isLoading = false;
    models = [];
    modelAPIName = '';

    @wire(getModels)
    wiredModels({error,data}){
        if (data) {
            this.models = [];

            for(const mod of data){
                this.models.push({label: mod.label, value: mod.APIName});
            }

            this.isLoading = false;
            this.modelAPIName = this.models[0].value;
            console.log(this.models);

        } else if (error) {
            this.isLoading = false;
            this.response = error;
        }
    }

    //imperative version to get models
    // connectedCallback(){

    //     this.isLoading = true;

    //     getModels().then(

    //         // Success
    //         (result) => {
    //             this.models = [];

    //             for(const mod of result){
    //                 this.models.push({label: mod.label, value: mod.APIName});
    //             }

    //             this.isLoading = false;
    //             this.modelAPIName = result[0].APIName;
    //             console.log(this.models);
    //         },

    //         // Error
    //         (error) => {
    //             this.isLoading = false;
    //             this.response = error;
    //         }
    //     )
        
    // }

    handlePromptChange(event){

        this.prompt = event.target.value;

    }

    handleClick(event) {
        this.response = 'Working…';
        this.isLoading = true;

        generateResponse({prompt: this.prompt, modelAPIName: this.modelAPIName})
            .then(result => {
                this.response = result;
                this.error = undefined;    
                this.isLoading = false;      
            })
            .catch(error => {
                this.response = error;
                this.isLoading = false;
            });
    }

    handleKeydown(event) {

        // Check if the Enter key was pressed
        if (event.keyCode === 13) {
            this.handleClick();
        }
    }

    handleModelChange(event){

        this.modelAPIName = event.target.value;

    }
    
}

