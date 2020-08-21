import numpy as np
import pandas as pd
from os import path
from PIL import Image
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import sys
import json

import matplotlib.pyplot as plt

text = sys.argv[1]
stopwords = sys.argv[2].split("\n")

# Create and generate a word cloud image:
wordcloud_dict = WordCloud(stopwords=stopwords).process_text(text)

print(json.dumps(wordcloud_dict))