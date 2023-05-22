sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (BaseController, JSONModel, History, formatter ,Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("finalproject.controller.Object", {

        formatter: formatter,
        id : '',
     

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            this._aValidKeys = ["Commande", "Demande"];
            
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                    busy : false,
                    delay : 0,
                    lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading"),
                    frequencyU : 0,
                    detail : ''

                });
            

            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");

        

           
            

            // this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
        },
       
        onTabSelect : function(oEvent){
			var sSelectedTab = oEvent.getParameter("selectedKey");
			this.getRouter().navTo("object", {
				objectId: this.id,
				query: {
					tab: sSelectedTab
				}
			}, true);// true without history

		},
        onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// No item should be selected on master after detail page is closed
			// this.getOwnerComponent().oListSelector.clearMasterListSelection();
            this.getModel("appView").setProperty("/layout", "OneColumn")
			this.getRouter().navTo("worklist");
		},
        toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}

		},
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */


        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        onNavBack : function() {
            // eslint-disable-next-line sap-no-history-manipulation
            // history.go(-1);
            this.getModel("appView").setProperty("/layout", "OneColumn");
    
            sap.ui.core.UIComponent.getRouterFor(this).navTo("Home")
        },
        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched : function (oEvent) {
            this.getRouter().getTargets().display("worklist")
           
            var oArgument = oEvent.getParameter("arguments")
            console.log(oArgument)
            var sObjectId =  oEvent.getParameter("arguments").objectId;

            if (this.getModel("appView").getProperty("/layout") !== "MidColumnFullScreen") {
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			}
            var id = sObjectId
            id = id.substring(id.length-2 , 2)
			let value1 = id
            value1 = parseInt(value1).toString();
			if(id.length < 10){
				do{
	
				id = '0'+id
	
			   }while(id.length < 10)
			}
            
			id = "('"+id+"')"
            
            this.id= id;
            
            
          var oModell = this.getOwnerComponent().getModel();
          
          var oViewModel = this.getModel("objectView")
          this._bindView("/CommandeSet" + id);
   
            oModell.read("/CommandeSet"+id,{success: function(odata, response){
                var util  = odata.Utulisateur;
                var s = 0
                oModell.read("/CommandeSet",{success: function(odata, response){
                    for(let i=0 ; i<odata.results.length ; i++){
                        if(odata.results[i].Utulisateur == util){
                            s = s + 1
                        }
                    }
                    s = s * 100 / odata.results.length
                    oViewModel.setProperty("/frequencyU", s) 
                    if(s < 25){
                        oViewModel.setProperty("/fillc", "red") 
                    }else if(s >=25 && s <50){
                        oViewModel.setProperty("/fillc", "blue") 
                    }else{
                        oViewModel.setProperty("/fillc", "green") 
                    }



                    var items = []
                    var dateMY ; 
                    for(var j = 1 ; j <= 12 ; j++){
                        let s = 0 ;
                        
                    for(var i = 0  ; i< odata.results.length ; i++){
                     
                        var date = new Date(odata.results[i].Datecreation) 
                        var yeara = new Date().getFullYear() 
                        var month =   date.getMonth() + 1
                        var year = new Date(odata.results[i].Datecreation).getFullYear() 
    
                        if (month == j && year == yeara && odata.results.Utulisateur == util){
                            s = s + 1 ;
                           
                        }
                        dateMY = new Date(yeara , j-1 , 1);
                    }
                    items.push({j , s , dateMY})      
                }
                  oViewModel.setProperty("/frequency" ,items)
                    
                }
                }) 
               
                
            }
            } )
           
 
           
            // this._bindTab("/postecommandeSet" , id);
            // this.getRouter().getTargets().display("worklist");
            
            
            var oQuery = oArgument["?query"];
            if (oQuery && this._aValidKeys.indexOf(oQuery.tab) >= 0){
				this.getModel("objectView").setProperty("/selectedTab", oQuery.tab);
				this.getRouter().getTargets().display(oQuery.tab);
			} else {
				this.getRouter().navTo("object", {
					objectId: id,
					query: {
						tab: "Commande"
					}
				}, true);
			}
            oModell.read("/postecommandeSet" , {success: function(odata, response){
                var items = []
                    for(var i=0 ; i<odata.results.length ; i++){
                        if(value1 == odata.results[i].NumCa){
                            items.push(odata.results[i])
                        }
                    }
                    oViewModel.setProperty("/detail" , items)
                    console.log(items)
         }})
            // console.log(id);
            // console.log(value1)
            // var aTableSearchState = [];
            // aTableSearchState = [new Filter("NumCa", FilterOperator.EQ, value1)];
            // console.log(this.byId("table"));
			// var oTable = this.byId("table")
			// oTable.getBinding("items").filter(aTableSearchState, "Application");
        },


        getDetail : function(value1){
            var  oViewModel = this.getModel("objectView")
            var oModell = this.getOwnerComponent().getModel();
            oModell.read("/postecommandeSet" , {success: function(odata, response){
                         console.log(odata)
                      oViewModel.setProperty("/detail" , odata.results)
                     
            }})
            console.log(this.getModel("objectView").getData())
            // var aTableSearchState = [];
            //  aTableSearchState = [new Filter("NumCa", FilterOperator.EQ, value1)];
            //  var oTab = this.byId("table")
            //  console.log(oTab);
             

        },
        onSelectionChange : function(oEvent){
            console.log(oEvent.getSource().getBindingContext())
            let target = oEvent.getSource().sId.substring("application-finalproject-display-component---object--_IDGenColumnListItem1-application-finalproject-display-component---object--table-".length)
            var item = this.getModel("objectView").getProperty("/detail/"+target)
            // this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", true);
            // this.getModel("appView").setProperty("/layout", "OneColumn");s
            // console.log(target)
            console.log(target);
                        this._showDetail(item);
            // this.getModel("appView").setProperty("/layout", "OneColumn");
        },
        _showDetail : function (oItem) {
            
            // set the layout property of FCL control to show two columns
            // this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
    
            // this.getModel("appView").setProperty("/mixed", false);
            console.log(oItem);

            this.getModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");
                 
            this.getRouter().navTo("objectDetail", {
                orderId: oItem.NumCa,
                postId : oItem.NumPoste
            });
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView : function (sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange : function () {
            var oView = this.getView(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.NumCa,
                sObjectName = oObject.CommandeSet;

                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/shareSendEmailSubject",
                    oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
                oViewModel.setProperty("/shareSendEmailMessage",
                    oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        },
        valider: function(){
            var oModel = this.getOwnerComponent().getModel();
            console.log(this.id)
            oModel.read("/CommandeSet"+this.id , { success :function (odata , response){
				odata.Statut = 'X'
	
				oModel.create("/CommandeSet", odata , {success : function(response){ 
					console.log("success");
			   }, error : function(error){
			   } })
	
			}, error : function(error){
				
	
			}})


        },
        Imprimer : function(oEvent){
            var oModel  = this.getOwnerComponent().getModel("Fac")
            var opdfViewer = new sap.m.PDFViewer();
			this.getView().addDependent(opdfViewer);
			var sServiceURL = oModel.sServiceUrl;
			var sSource = "http://10.104.12.91:8000"+ sServiceURL + "/MM_FACINWISet"+this.id+"/$value";
            // console.log(sSource)
			// opdfViewer.setSource(sSource);
			// opdfViewer.setTitle( "My PDF");
			// opdfViewer.open();	
            var w = window.open(sSource);
            if (w == null) {
                MessageBox.warning(oBundle.getText("Error.BlockedPopUp"));
            }
  
        },
        Mail : function (OEvent){
			console.log("heelo");
			// this._onIncPercentage()
			var oModel = this.getOwnerComponent().getModel();
			
                oModel.read("/MailMMSet"+this.id , { success :function (odata , response){
                    alert("Mail sended successfully ")
                }, error : function(error){
                    alert("we can t send mail " + error)    

                }})
		   
		},
        
    });

});
