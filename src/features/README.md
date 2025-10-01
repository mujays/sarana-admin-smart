# Description

In order to simplify and ensure easy maintenance of the application's scalability, our objective is to centralize the majority of the application code within the features folder. This folder will house various feature-related components, allowing us to segregate domain-specific code for each feature. By adopting this approach, we can confine functionalities to specific features without intermingling their declarations with shared elements.

## Sub folders inside of a feature

The folders inside of a feature has the same folder structure with src folder. So it can contain a api folder, config folder, components folder, etc

## Usage

Code outside of the feature folder should only export from @/features/${FEATURE_NAME}. This will force us to explicitly make something in a feature publicly available. Thus encapsulating the feature. Making sure only ready to be public shared code is going to be used in another place
