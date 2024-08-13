import { LightningElement } from 'lwc';
import generateResponse from '@salesforce/apex/ModelsAPIController.generateResponse';
import getModels from '@salesforce/apex/ModelsAPIController.getModels';

export default class ModelsAPITest extends LightningElement {

    prompt = '';
    response = '';
    isLoading = false;
    models = [];
    modelAPIName = '';

    connectedCallback(){

        this.isLoading = true;

        getModels().then(

            // Success
            (result) => {
                this.models = [];

                for(const mod of result){
                    this.models.push({label: mod.label, value: mod.APIName});
                }

                this.isLoading = false;
                this.modelAPIName = result[0].APIName;
                console.log(this.models);
            },

            // Error
            (error) => {
                this.isLoading = false;
                this.response = error;
            }
        )
        
    }

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

