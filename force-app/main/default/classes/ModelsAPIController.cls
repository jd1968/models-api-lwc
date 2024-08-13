public with sharing class ModelsAPIController {
    
    @AuraEnabled(cacheable=true)
    public static String generateResponse(String prompt, String modelAPIName){

        // Create generate text request
        aiplatform.ModelsAPI.createGenerations_Request request = new aiplatform.ModelsAPI.createGenerations_Request();

        // Specify model
        request.modelName = modelAPIName;

        // Create request body
        aiplatform.ModelsAPI_GenerationRequest requestBody = new aiplatform.ModelsAPI_GenerationRequest();
        request.body = requestBody;

        // Add prompt to body
        requestBody.prompt = prompt;

        try {
            // Make request
            aiplatform.ModelsAPI modelsAPI = new aiplatform.ModelsAPI();

            System.debug('Models API request: ' + request);
            aiplatform.ModelsAPI.createGenerations_Response response = modelsAPI.createGenerations(request);
            
            String responseText = response.Code200.generation.generatedText;
            System.debug('Models API response: ' + responseText);
            return responseText;
        
        // Handle error
        } catch(aiplatform.ModelsAPI.createGenerations_ResponseException e) {
            System.debug('Response code: ' + e.responseCode);
            System.debug('The following exception occurred: ' + e);
            throw new AuraHandledException(e.getMessage());
        }
    }

    //return a list of models that can be used with Models API
    @AuraEnabled(cacheable=true)
    public static List<Model> getModels(){

        List<Model> models = new List<Model>();

        models.add(new Model('OpenAI GPT 4 Turbo','sfdc_ai__DefaultOpenAIGPT4Turbo'));
        models.add(new Model('OpenAI GPT 4 32k','sfdc_ai__DefaultOpenAIGPT4_32k'));
        models.add(new Model('Anthropic Claude 3 Haiku on Amazon','sfdc_ai__DefaultBedrockAnthropicClaude3Haiku'));
        // models.add(new Model('OpenAI GPT 4 32k','sfdc_ai__DefaultOpenAIGPT4_32k'));
        // models.add(new Model('OpenAI GPT 4 32k','sfdc_ai__DefaultOpenAIGPT4_32k'));
        // models.add(new Model('OpenAI GPT 4 32k','sfdc_ai__DefaultOpenAIGPT4_32k'));


        return models;

    }

    public class Model{
        @AuraEnabled
        public String label;

        @AuraEnabled
        public String APIName;

        public Model(string newLabel, string newAPIName){

            Label = newLabel;
            APIName = newAPIName;

        }
    }
}