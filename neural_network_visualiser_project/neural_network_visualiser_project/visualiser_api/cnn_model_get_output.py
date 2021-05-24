#import tensorflow as tf

#from tensorflow.keras import datasets, layers, models
#from keras.datasets import mnist #minst is the handwritte number dataset

#from matplotlib import pyplot
import numpy as np#for prediction

from keras import backend as K
from .cnn_model import model


# load dataset
#(trainX, trainy), (testX, testy) = mnist.load_data()
# reshape dataset to have a single channel
#trainX = trainX.reshape((trainX.shape[0], 28, 28, 1))
#testX = testX.reshape((testX.shape[0], 28, 28, 1))
#limiting input between 0 and 1
#(trainX, trainy), (testX, testy) = (trainX/255.0,trainy),(testX/255,testy)


def get_first_layer_output(input=None,index=None):
    # with a Sequential model
    get_1st_layer_output = K.function([model.layers[0].input],
                                      [model.layers[0].output])

    #for input
    #predicting
    if input.any==None:
      predictions_input = testX[index:index+1]
    else:
      predictions_input=input
    first_layer_output=get_1st_layer_output(predictions_input)[0]
    #for first layer output
    #getting first layers
    layers_to_get=32
    layers=[
              [
               [0 for _ in range(26)] for _ in range(26)
              ] for _ in range(layers_to_get)
            ]
    for current_layer_index in range(layers_to_get) :
      for row_index in range(len(layers[0])):
        for col_index in range(len(layers[0][0])):
          layers[current_layer_index][row_index][col_index]=first_layer_output[0][row_index][col_index][current_layer_index]
    
    return layers


def get_second_layer_output(input=None,index=None):
    # with a Sequential model
    get_2nd_layer_output = K.function([model.layers[0].input],
                                      [model.layers[1].output])

    #for input
    #predicting
    if input.any==None:
      predictions_input = testX[index:index+1]
    else:
      predictions_input=input
    first_layer_output=get_2nd_layer_output(predictions_input)[0]
    #for second layer output
    #getting second layers
    layers_to_get=32
    layers=[
              [
               [0 for _ in range(13)] for _ in range(13)
              ] for _ in range(layers_to_get)
            ]
    for current_layer_index in range(layers_to_get) :
      for row_index in range(len(layers[0])):
        for col_index in range(len(layers[0][0])):
          layers[current_layer_index][row_index][col_index]=first_layer_output[0][row_index][col_index][current_layer_index]
    
    return layers


def get_output(input=None,index=None):
    #predicting
    if input.any==None:
        index=index
        predictions_input = testX[index:index+1]
    else:
        predictions_input=input

    predictions=model.predict(predictions_input)
    prediction=predictions[0]
    max_index=0
    for j in range(1,10):
        if prediction[j]>prediction[max_index]:
            max_index=j
    return max_index
""" 


input_index=9
index_of_cnn_layer=12
#input
predictions_input = testX[input_index:input_index+1]
prediction_input = predictions_input
reshaped_input=prediction_input.reshape((28,28))
#first layer
first_layer_outputs=get_first_layer_output(input=prediction_input)
#second layer
second_layer_outputs=get_second_layer_output(input=prediction_input)
#main oupput
output=get_output(input=prediction_input)
print(output) """

def return_output(matrix):
  prediction_input=np.array(matrix).reshape(1,28,28,1)
  #first layer
  first_layer_outputs=get_first_layer_output(input=prediction_input)
  #second layer
  second_layer_outputs=get_second_layer_output(input=prediction_input)
  #main oupput
  output=get_output(input=prediction_input)
  return {
    "first_layer_output":first_layer_outputs,
      "second_layer_ouput":second_layer_outputs,
      "output":output
  }