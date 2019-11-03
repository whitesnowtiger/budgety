/*
var budgetController = (function() {
    
    var x = 23;
    
    var add = function(a) {
        return x + a;
    }
    
    return {
        publicTest: function(b) {
            return add(b)
        }
    }
    
})();


var UIController = (function() {
    
    
    
})();


var controller = (function(budgetCtrl, UICtrl) {
    
    var z = budgetCtrl.publicTest(5);
    
    return {
        anotherPublic: function() {
            console.log(z);
        }
     }
    
})(budgetController, UIController);  
*/

var budgetController = (function() {
    
   var Expense = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
   }
   
   Expense.prototype.calcPercentge = function(totalIncome) {
       
       if(totalIncome >0 ) {
       
       this.percentage = Math.round(this.value/totalIncome *100);
           
       } else {
           this.percentage = -1;
       }
       
   };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage
    }
    
   var Income = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
   }
   
    var calculateTotal = function(type) {
        
        var sum = 0;
        data.allItems[type].forEach(function(curr) {
            sum += curr.value;
        });
        
        data.totals[type] = sum;
        
    };
   
   /*var allExpenses = [];
   var allIncomes = [];
    var totalExpenses = 0;*/
   var data = {
       allItems: {
           exp: [],
           inc: []
       },
       totals: {
           exp: 0,
           inc: 0
       },
       budget: 0,
       percentage: -1
   };
    
   
    
    return {
        addItem: function(type, des, val) {
            var newItem, id;
            
            //create new ID
            if( data.allItems[type].length >0) {
                id = data.allItems[type][data.allItems[type].length-1].id+1;  
            } else {
                id = 0; 
            }
            
            
            
            //create new item based on the 'inc' or 'exp' type
            if(type ===  'exp') {
                 newItem = new Expense(id, des, val) ;   
            } else if(type==='inc' ) {
                newItem= new Income(id,des, val)
            }
            
            //push it into our data structure
           data.allItems[type].push(newItem);
            
            //return the new element
            return newItem;
        },
        
        deleteItem: function(type, id) {
            
            var ids, index;
            
            ids = data.allItems[type].map(function(current) {   //copies and return a new array w/ ids
                
               return current.id;                               //current is object
            });
            
            index = ids.indexOf(id);        // if id = 6 in ids = [1 2 4 6 8] indexOf return index=3
            
            if(index !== -1) {              // if it's -1, then you didn't find that id
                data.allItems[type].splice(index, 1) ;  //which id u want to delete and how many from there
            }
        },
        
        calculateBudget: function() {
            
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            
            //calculate the budget: income - expenses
            
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else { 
                data.percentage = -1;    
            }
            
        },
        
        calculatePercentages: function() {
          
            data.allItems.exp.forEach( function(cur) {
                
                cur.calcPercentge(data.totals.inc);
                
            });
            
            
        },
        
        getPercentages: function() {
            
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            
            return allPerc;
            
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }   
        },
        
        
        testing: function() {
            console.log(data)
        }
        
    }
    
    
})();




var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage', 
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLable: '.budget__title--month'
    };
    
     
      var formatNumber = function(num, type) {
            
            var numSplit, int, dec, sign;
            
            num = Math.abs(num)
            num = num.toFixed(2);    //2129.3233 -> 2129.32 or 200 -> 200.00
            //num is integer, primitive but we can use toFixed method becuas it wraps the num and use the method.  It returns string
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            if(int.length > 3) {
                int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
            }
            
            
            
            dec = numSplit[1];
            
            sign = (type === 'exp') ? '-' : '+';
            
            return sign + ' ' + int + '.' + dec;
            
            
        };
    
      var nodeListForEach = function(list, callback) {
                
                for(var i = 0; i<list.length; i++) {
                    callback(list[i], i);
                }
            };
    
    
        
    
    return {
      getinput: function() {
          
          return {
              
              type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
              description: document.querySelector(DOMstrings.inputDescription).value,
          
              value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
              
          };
          
      },
        
        addListItem: function(obj, type) {
            
            var html, newHtml, element;
          
            //Create HTML string with placeholder text
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            
            }
                    
            
               
            
            //Replace the placeholder text with some actual data
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            
            //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
            //element.insertAdjacentHTML(position, text);
            
            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
            
            
            
        },
        
        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function() {
            var field, fieldArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            //querySelectorAll returns a list not array so we can't use method such as slice
            
            fieldArr  = Array.prototype.slice.call(fields); //list to array
            
            fieldArr.forEach(function (current, index, array) {
                current.value ='';
                
            });
            fieldArr[0].focus();
        },
        
        displayBudget: function(obj) {
            
            var type = obj.budget > 0 ? 'inc' : 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.percentage > 0){
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },
        
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); 
            //returns a node list - each element in HTML are nodes
            
          
            
            nodeListForEach(fields, function(current, index) {    
                //current is the whole <div class=item__percentage
               
                if(percentages[index] > 0 ) {
               current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });    
        },
        
        
        displayMonth: function() {
             var now, year, month, months;
            
            months = [ 'January', 'Febuary' , 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
             
             now = new Date();
            
            month = now.getMonth();
            year = now.getFullYear();
            
            document.querySelector(DOMstrings.dateLable).textContent = months[month] + ' ' + year;
            
            //month = now.getFullMonth;
            
        },
       
        
        changeType: function() {
        
            
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ', ' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
        )
            
            nodeListForEach(fields, function(cur) {
                
                cur.classList.toggle('red-focus');
                
            }) ;
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        
        
        
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();


var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); 


        document.addEventListener('keypress', function(event) {

            if(event.keyCode === 13 || event.which === 13) {

                      ctrlAddItem();
            }    
   });
        
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
        
        
        
};
    
    var updateBudget = function() {
        
         //4. Calculate the budget
        
        budgetCtrl.calculateBudget();
        
        //4-1. Reture the budget
        
        var budget = budgetCtrl.getBudget();
        
        //5. Display the budget on the UI
        UICtrl.displayBudget(budget);
        
    };
    
    var updataPercentage = function() {
        
        //1. Calculate the percentage
        budgetCtrl.calculatePercentages();
        
        //2. Read percentage from the budget controller
        var percentages = budgetCtrl.getPercentages();
        
        //3. Update the UI with the new percentage
        UICtrl.displayPercentages(percentages);
        console.log(percentages);
        
    }
    
    var ctrlAddItem = function() {
        
        var input, newItem;
        
        //1. Get the filed input data
        input = UICtrl.getinput();
        console.log(input);
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
        
        //2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        //3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // Clear the fields
        UICtrl.clearFields();
        
       
        //4.updateBudget
        updateBudget();
            
        //5.calculate and updatePercentage
        updataPercentage();
            
            
        }
    };
    
    var ctrlDeleteItem = function(event) {
        
        var itemID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        
        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
                budgetCtrl.deleteItem(type, ID);
            
            
            // 2. delete the item from the UI
            
                UICtrl.deleteListItem(itemID);
            
            // 3. update and show the new budget 
            
                updateBudget();
            
            // 4.calculate and updatePercentage
                updataPercentage();
        }
        
    }
    
    
    return {
        init: function() {
            
            UICtrl.displayMonth();
           
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
              
            });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);  



controller.init();





