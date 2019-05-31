## Build and push to Helm repo

```
cd app/
docker build -t gcr.io/test-kubeapps/radiance-timestack .
docker push gcr.io/test-kubeapps/radiance-timestack
cd ../radiance-timestack/
helm package .
curl --data-binary "@radiance-timestack-0.1.0.tgz" http://35.234.73.71:8080/api/charts
```

    