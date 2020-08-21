import numpy as np
import pandas as pd
from os import path, getcwd
from PIL import Image
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import sys

import matplotlib.pyplot as plt

text = sys.argv[1]
stopwords = sys.argv[3].split("\n")

# Create and generate a word cloud image:
wordcloud = WordCloud(stopwords=stopwords).generate(text)

wordcloud.to_file(getcwd() + '/outputs/' + sys.argv[2] + '.png');