# Create custom and reusable charts right within Power BI

Charticulator (charticulator.com or https://ilfat-galiev.im/charticulator/) is the no-code way to create custom and reusable chart designs. You can create a custom chart right within Power BI using the Microsoft Charticulator Visual, either from scratch or using a template. With this visual, you can export and import a chart design as a Charticulator template for future reuse. To learn about the core concepts, UI components, and basic interactions of Charticulator, please check out the Getting Started and Video Tutorials pages on the Charticulator website. Also note that many of the charts in the Gallery page have an associated video of their creation process. Charticulator is compatible with the latest version of Microsoft Edge, Google Chrome, and Mozilla Firefox, but not with Edge Legacy and Safari.

This version of the visual has built in editor.
The purpose of the visual is editing or creating templates only to use Charticulator Visual Community (View). 

Change log and difference from original Charticulator:

* Packing inside group
* Add color filter for image on selection
* Fix restoring properties for nested chart
* Catch exception on detect changes that breaks entire editor
* Reuse hex code from dataset for scales
* Render axis gridlines even axis is invisible
* Allow to convert time to local time zon
* Remove removing tick format for categorical and ordinal data kind
* Fix ordering expression for axes