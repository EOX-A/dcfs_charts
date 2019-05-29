## Build and push to Helm repo

```
cd app/
docker build -t gcr.io/test-kubeapps/ndvi-timeline .
docker push gcr.io/test-kubeapps/ndvi-timeline
cd ../ndvi-timeline/
helm package .
curl --data-binary "@ndvi-timeline-0.1.0.tgz" http://35.234.73.71:8080/api/charts
```

    