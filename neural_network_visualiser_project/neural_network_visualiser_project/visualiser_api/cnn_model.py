import tensorflow as tf

from tensorflow.keras import datasets, layers, models
from keras.datasets import mnist #minst is the handwritte number dataset

from keras import backend as K

from pathlib import Path
import os


#get the saved model
model_dir=Path(__file__).resolve().parent
model=os.path.join(model_dir,"model","saved_model.h5")
model = tf.keras.models.load_model(model)
